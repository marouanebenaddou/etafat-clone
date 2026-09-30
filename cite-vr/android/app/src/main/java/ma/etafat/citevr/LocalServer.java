package ma.etafat.citevr;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Tiny static HTTP server for the bundled Cité viewer + drone model (assets/www), bound to 127.0.0.1 only.
 * Runs as a foreground service so it stays up while the Quest Browser is in front.
 */
public class LocalServer extends Service {
    public static final int PORT = 48621; // ETAFAT VR (globe) uses 48620: both apps can coexist
    static volatile boolean running = false;

    private ServerSocket server;
    private ExecutorService pool;

    @Override
    public void onCreate() {
        super.onCreate();
        NotificationManager nm = getSystemService(NotificationManager.class);
        nm.createNotificationChannel(new NotificationChannel("server", "Cité portugaise VR", NotificationManager.IMPORTANCE_LOW));
        Notification n = new Notification.Builder(this, "server")
                .setContentTitle("Cité portugaise VR")
                .setContentText("Maquette 3D hors ligne active")
                .setSmallIcon(R.mipmap.ic_launcher)
                .build();
        startForeground(1, n);
        pool = Executors.newFixedThreadPool(12); // the tile streamer keeps ~10 downloads in flight
        new Thread(this::serve, "cite-http").start();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        running = false;
        try { if (server != null) server.close(); } catch (IOException ignored) { }
        if (pool != null) pool.shutdownNow();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }

    private void serve() {
        try {
            server = new ServerSocket();
            server.setReuseAddress(true);
            server.bind(new java.net.InetSocketAddress(InetAddress.getByName("127.0.0.1"), PORT), 64);
            running = true;
            while (!server.isClosed()) {
                Socket s = server.accept();
                pool.execute(() -> handle(s));
            }
        } catch (IOException e) {
            running = false;
        }
    }

    private void handle(Socket s) {
        try (Socket sock = s) {
            sock.setSoTimeout(15000);
            BufferedReader in = new BufferedReader(new InputStreamReader(sock.getInputStream(), StandardCharsets.ISO_8859_1));
            String line = in.readLine();
            if (line == null) return;
            String[] parts = line.split(" ");
            String method = parts[0];
            String target = parts.length > 1 ? parts[1] : "/";
            while ((line = in.readLine()) != null && !line.isEmpty()) { /* headers not needed */ }
            OutputStream out = new BufferedOutputStream(sock.getOutputStream());
            boolean head = method.equals("HEAD");
            if (!method.equals("GET") && !head) { send(out, 405, "Method Not Allowed", "text/plain", "405".getBytes(), false, null); return; }

            String path = target;
            int q = path.indexOf('?'); if (q >= 0) path = path.substring(0, q);
            int h = path.indexOf('#'); if (h >= 0) path = path.substring(0, h);
            path = URLDecoder.decode(path.replace("+", "%2B"), "UTF-8");
            if (path.equals("/")) { send(out, 302, "Found", "text/plain", new byte[0], head, "/index.html"); return; }
            if (path.endsWith("/")) path += "index.html";
            if (path.contains("..") || !path.startsWith("/")) { send(out, 403, "Forbidden", "text/plain", "403".getBytes(), head, null); return; }

            byte[] body;
            try (InputStream is = getAssets().open("www" + path)) {
                body = readAll(is);
            } catch (IOException notFound) {
                send(out, 404, "Not Found", "text/plain", "404".getBytes(), head, null);
                return;
            }
            send(out, 200, "OK", mime(path), body, head, null, path.startsWith("/model/"));
        } catch (IOException ignored) { }
    }

    private static void send(OutputStream out, int code, String reason, String type, byte[] body, boolean head, String location) throws IOException {
        send(out, code, reason, type, body, head, location, false);
    }

    private static void send(OutputStream out, int code, String reason, String type, byte[] body, boolean head, String location, boolean immutable) throws IOException {
        StringBuilder sb = new StringBuilder();
        sb.append("HTTP/1.1 ").append(code).append(' ').append(reason).append("\r\n");
        sb.append("Content-Type: ").append(type).append("\r\n");
        sb.append("Content-Length: ").append(body.length).append("\r\n");
        sb.append(immutable ? "Cache-Control: public, max-age=604800, immutable\r\n" : "Cache-Control: no-cache\r\n"); // model tiles never change
        if (location != null) sb.append("Location: ").append(location).append("\r\n");
        sb.append("Connection: close\r\n\r\n");
        out.write(sb.toString().getBytes(StandardCharsets.ISO_8859_1));
        if (!head) out.write(body);
        out.flush();
    }

    private static byte[] readAll(InputStream is) throws IOException {
        ByteArrayOutputStream bo = new ByteArrayOutputStream(64 * 1024);
        byte[] buf = new byte[64 * 1024];
        int n;
        while ((n = is.read(buf)) > 0) bo.write(buf, 0, n);
        return bo.toByteArray();
    }

    private static String mime(String p) {
        String l = p.toLowerCase();
        if (l.endsWith(".html")) return "text/html; charset=utf-8";
        if (l.endsWith(".js") || l.endsWith(".mjs")) return "text/javascript; charset=utf-8";
        if (l.endsWith(".json")) return "application/json; charset=utf-8";
        if (l.endsWith(".webmanifest")) return "application/manifest+json";
        if (l.endsWith(".css")) return "text/css; charset=utf-8";
        if (l.endsWith(".png")) return "image/png";
        if (l.endsWith(".jpg") || l.endsWith(".jpeg")) return "image/jpeg";
        if (l.endsWith(".svg")) return "image/svg+xml";
        if (l.endsWith(".glb")) return "model/gltf-binary";
        if (l.endsWith(".wasm")) return "application/wasm";
        if (l.endsWith(".mp3")) return "audio/mpeg";
        if (l.endsWith(".ktx2")) return "image/ktx2";
        if (l.endsWith(".mp4")) return "video/mp4";
        if (l.endsWith(".ico")) return "image/x-icon";
        return "application/octet-stream";
    }
}
