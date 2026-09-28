package ma.etafat.borne;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;

import com.getcapacitor.BridgeActivity;

/**
 * ETAFAT borne tactile.
 * Kiosk behaviour: screen kept awake + immersive fullscreen (restored on focus).
 * Exposes a JS bridge (window.BorneApps) so the "Applications" tile can launch
 * the field apps that are installed on the borne — they run on the tablet itself.
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
