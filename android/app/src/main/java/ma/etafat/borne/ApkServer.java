package ma.etafat.borne;

import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;

import java.io.InputStream;

import fi.iki.elonen.NanoHTTPD;

/**
 * Tiny embedded HTTP server that streams the bundled field-app APKs
 * (assets/apks/*.apk) over the borne's WiFi so visitors' phones can install
 * them fully offline. Started by MainActivity on port 8765.
 */
public class ApkServer extends NanoHTTPD {
    private final AssetManager assets;

    public ApkServer(int port, AssetManager assets) {
        super(port);
        this.assets = assets;
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();
        if (uri != null && uri.startsWith("/apks/") && uri.endsWith(".apk") && !uri.contains("..")) {
            String assetPath = "apks/" + uri.substring("/apks/".length());
            try {
                AssetFileDescriptor afd = assets.openFd(assetPath); // needs noCompress "apk"
                InputStream is = afd.createInputStream();
                String name = uri.substring(uri.lastIndexOf('/') + 1);
                Response res = newFixedLengthResponse(
                        Response.Status.OK,
                        "application/vnd.android.package-archive",
                        is, afd.getLength());
                res.addHeader("Content-Disposition", "attachment; filename=\"" + name + "\"");
                res.addHeader("Access-Control-Allow-Origin", "*");
                return res;
            } catch (Exception e) {
                return newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "APK introuvable");
            }
        }
        // simple landing page (also usable directly in a browser)
        return newFixedLengthResponse(Response.Status.OK, "text/html",
                "<!doctype html><meta charset=utf-8>"
              + "<meta name=viewport content='width=device-width,initial-scale=1'>"
              + "<title>ETAFAT — Applications</title>"
              + "<body style='font-family:sans-serif;max-width:32rem;margin:2rem auto;padding:0 1rem'>"
              + "<h1>ETAFAT — Applications terrain</h1><ul>"
              + "<li><a href='/apks/procasef.apk'>PROCASEF</a></li>"
              + "<li><a href='/apks/presfor.apk'>PRESFOR</a></li>"
              + "<li><a href='/apks/srm.apk'>SRM</a></li>"
              + "</ul></body>");
    }
}
