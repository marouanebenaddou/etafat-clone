package ma.etafat.borne;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;

import androidx.browser.customtabs.CustomTabsIntent;

import com.getcapacitor.BridgeActivity;

/**
 * ETAFAT borne tactile.
 * Kiosk behaviour: screen kept awake + immersive fullscreen (restored on focus).
 * Exposes a JS bridge (window.BorneApps) so the "Applications" tile can open the
 * field apps' web versions in a Chrome Custom Tab over the kiosk (its close button
 * comes back to the borne), or launch an app installed on the tablet.
 */
public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    try {
      getBridge().getWebView().addJavascriptInterface(new BorneApps(), "BorneApps");
    } catch (Exception e) {
      // ignore — kiosk still works, launch buttons simply won't act
    }
  }

  /** Bridge callable from the kiosk web UI. */
  public class BorneApps {
    @JavascriptInterface
    public String installed(String pkg) {
      try {
        getPackageManager().getPackageInfo(pkg, 0);
        return "1";
      } catch (Exception e) {
        return "0";
      }
    }

    /** Opens a web app in a Chrome Custom Tab (browser fallback). Only http(s) URLs. */
    @JavascriptInterface
    public String openUrl(String url) {
      if (url == null || !(url.startsWith("https://") || url.startsWith("http://"))) return "invalid";
      runOnUiThread(() -> {
        Uri uri = Uri.parse(url);
        try {
          new CustomTabsIntent.Builder().setShowTitle(true).build().launchUrl(MainActivity.this, uri);
        } catch (Exception e) {
          try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
          } catch (Exception ignored) {
            // no browser on the tablet
          }
        }
      });
      return "ok";
    }

    @JavascriptInterface
    public String launch(String pkg) {
      try {
        Intent intent = getPackageManager().getLaunchIntentForPackage(pkg);
        if (intent == null) return "notfound";
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        return "ok";
      } catch (Exception e) {
        return "error";
      }
    }
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
}
