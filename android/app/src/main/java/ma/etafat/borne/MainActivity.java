package ma.etafat.borne;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Collections;

import fi.iki.elonen.NanoHTTPD;

/**
 * ETAFAT borne tactile.
 * Kiosk behaviour: screen kept awake + immersive fullscreen (restored on focus).
 * Also runs a local HTTP server (ApkServer) that serves the bundled field-app
 * APKs over WiFi, and exposes its base URL to the kiosk web UI (so it can render
 * download QR codes pointing at the borne) — everything works with no internet.
 */
public class MainActivity extends BridgeActivity {

  private static final int APK_PORT = 8765;
  private ApkServer apkServer;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

    // Local APK file server (optional — the kiosk still works without it).
    try {
      apkServer = new ApkServer(APK_PORT, getAssets());
      apkServer.start(NanoHTTPD.SOCKET_READ_TIMEOUT, true);
    } catch (Exception e) {
      // ignore
    }

    // Expose the borne's base URL to the web UI: a JS interface (for reads) plus
    // repeated window.__BORNE_BASE injections (covers page-load / WiFi timing).
    try {
      getBridge().getWebView().addJavascriptInterface(new BorneJs(), "BorneServer");
    } catch (Exception e) {
      // ignore
    }
    injectBaseUrl();
  }

  private void injectBaseUrl() {
    final WebView wv = getBridge().getWebView();
    if (wv == null) return;
    wv.postDelayed(new Runnable() {
      int tries = 0;
      @Override
      public void run() {
        String base = baseUrl();
        if (base != null) {
          wv.evaluateJavascript("window.__BORNE_BASE='" + base + "';", null);
        }
        if (++tries < 12) wv.postDelayed(this, 1500);
      }
    }, 1000);
  }

  public class BorneJs {
    @JavascriptInterface
    public String getBaseUrl() {
      String b = baseUrl();
      return b == null ? "" : b;
    }
  }

  private String baseUrl() {
    String ip = lanIp();
    return ip == null ? null : "http://" + ip + ":" + APK_PORT;
  }

  /** First non-loopback site-local IPv4 (the borne's address on its WiFi/LAN). */
  private String lanIp() {
    try {
      for (NetworkInterface ni : Collections.list(NetworkInterface.getNetworkInterfaces())) {
        if (ni.isLoopback() || !ni.isUp()) continue;
        for (InetAddress addr : Collections.list(ni.getInetAddresses())) {
          if (addr instanceof Inet4Address && addr.isSiteLocalAddress()) {
            return addr.getHostAddress();
          }
        }
      }
    } catch (Exception e) {
      // ignore
    }
    return null;
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) {
      hideSystemBars();
    }
  }

  @SuppressLint("InlinedApi")
  private void hideSystemBars() {
    View decor = getWindow().getDecorView();
    decor.setSystemUiVisibility(
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    if (apkServer != null) {
      apkServer.stop();
    }
  }
}
