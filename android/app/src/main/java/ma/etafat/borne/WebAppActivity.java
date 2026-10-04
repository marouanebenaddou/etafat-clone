package ma.etafat.borne;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

/**
 * A field app's web version shown full screen INSIDE the borne (its own WebView), with a top bar whose button
 * brings the visitor back to the kiosk. Nothing depends on another app: it works when the tablet is pinned /
 * in kiosk mode (where starting Chrome is blocked) and visitors can't wander off into a browser.
 * Load errors are shown on screen (with the reason) and offer a retry or Chrome as a last resort.
 */
public class WebAppActivity extends Activity {
  public static final String EXTRA_URL = "url";
  public static final String EXTRA_TITLE = "title";
  public static final String EXTRA_CLOSE = "close";

  private WebView web;
  private ProgressBar progress;
  private LinearLayout errorBox;
  private TextView errorText;
  private String startUrl;

  private int dp(float v) {
    return Math.round(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, getResources().getDisplayMetrics()));
  }

  @SuppressLint("SetJavaScriptEnabled")
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    startUrl = getIntent().getStringExtra(EXTRA_URL);
    String title = getIntent().getStringExtra(EXTRA_TITLE);
    String close = getIntent().getStringExtra(EXTRA_CLOSE);
    if (startUrl == null) { finish(); return; }

    LinearLayout root = new LinearLayout(this);
    root.setOrientation(LinearLayout.VERTICAL);
    root.setBackgroundColor(Color.WHITE);

    // top bar: « ✕ Retour à la borne » + app name
    LinearLayout bar = new LinearLayout(this);
    bar.setOrientation(LinearLayout.HORIZONTAL);
    bar.setGravity(Gravity.CENTER_VERTICAL);
    bar.setBackgroundColor(Color.parseColor("#0b2540"));
    bar.setPadding(dp(12), dp(8), dp(20), dp(8));
    Button back = new Button(this);
    back.setText("✕  " + (close != null ? close : "Retour à la borne"));
    back.setAllCaps(false);
    back.setTextColor(Color.WHITE);
    back.setTextSize(TypedValue.COMPLEX_UNIT_SP, 17);
    back.setTypeface(Typeface.DEFAULT_BOLD);
    back.setBackgroundColor(Color.parseColor("#2ab5b4"));
    back.setPadding(dp(20), dp(10), dp(20), dp(10));
    back.setOnClickListener(v -> finish());
    bar.addView(back, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
    TextView name = new TextView(this);
    name.setText(title != null ? title : "");
    name.setTextColor(Color.WHITE);
    name.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20);
    name.setTypeface(Typeface.DEFAULT_BOLD);
    name.setGravity(Gravity.END | Gravity.CENTER_VERTICAL);
    bar.addView(name, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
    root.addView(bar, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(68)));

    progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
    progress.setMax(100);
    root.addView(progress, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(4)));

    FrameLayout body = new FrameLayout(this);
    web = new WebView(this);
    body.addView(web, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

    // error panel (hidden until a load fails)
    errorBox = new LinearLayout(this);
    errorBox.setOrientation(LinearLayout.VERTICAL);
    errorBox.setGravity(Gravity.CENTER);
    errorBox.setBackgroundColor(Color.WHITE);
    errorBox.setPadding(dp(32), dp(32), dp(32), dp(32));
    errorBox.setVisibility(View.GONE);
    errorText = new TextView(this);
    errorText.setTextColor(Color.parseColor("#12293f"));
    errorText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
    errorText.setGravity(Gravity.CENTER);
    errorBox.addView(errorText);
    LinearLayout btns = new LinearLayout(this);
    btns.setGravity(Gravity.CENTER);
    btns.setPadding(0, dp(24), 0, 0);
    Button retry = new Button(this);
    retry.setText("Réessayer / Retry");
    retry.setAllCaps(false);
    retry.setOnClickListener(v -> { errorBox.setVisibility(View.GONE); web.loadUrl(startUrl); });
    btns.addView(retry);
    Button chrome = new Button(this);
    chrome.setText("Ouvrir dans Chrome / Open in Chrome");
    chrome.setAllCaps(false);
    chrome.setOnClickListener(v -> openInChrome());
    btns.addView(chrome);
    errorBox.addView(btns);
    body.addView(errorBox, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    root.addView(body, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
    setContentView(root);

    WebSettings s = web.getSettings();
    s.setJavaScriptEnabled(true);
    s.setDomStorageEnabled(true);
    s.setDatabaseEnabled(true);
    s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
    s.setUseWideViewPort(true);
    s.setLoadWithOverviewMode(true);
    s.setSupportZoom(true);
    s.setBuiltInZoomControls(true);
    s.setDisplayZoomControls(false);
    s.setMediaPlaybackRequiresUserGesture(false);
    s.setSupportMultipleWindows(false); // target=_blank links open in this same view
    CookieManager.getInstance().setAcceptCookie(true);
    CookieManager.getInstance().setAcceptThirdPartyCookies(web, true);

    web.setWebChromeClient(new WebChromeClient() {
      @Override
      public void onProgressChanged(WebView view, int p) {
        progress.setProgress(p);
        progress.setVisibility(p >= 100 ? View.INVISIBLE : View.VISIBLE);
      }
    });
    web.setWebViewClient(new WebViewClient() {
      @Override
      public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
        String scheme = req.getUrl().getScheme();
        return !("http".equals(scheme) || "https".equals(scheme)); // stay inside; ignore other schemes
      }

      @Override
      public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError err) {
        if (req.isForMainFrame()) showError(err.getDescription() + " (" + err.getErrorCode() + ")");
      }

      @Override
      public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
        handler.cancel(); // never bypass certificate errors
        showError("Certificat SSL refusé / SSL certificate rejected (" + error.getPrimaryError() + ")");
      }
    });
    web.loadUrl(startUrl);
  }

  private void showError(String reason) {
    errorText.setText("L’application ne répond pas.\nThe app could not be loaded.\n\n" + startUrl + "\n" + reason);
    errorBox.setVisibility(View.VISIBLE);
  }

  private void openInChrome() {
    Intent view = new Intent(Intent.ACTION_VIEW, Uri.parse(startUrl));
    try {
      view.setPackage("com.android.chrome");
      startActivity(view);
    } catch (Exception e) {
      try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(startUrl))); } catch (Exception ignored) { }
    }
  }

  @Override
  public void onBackPressed() {
    if (web != null && web.canGoBack()) web.goBack();
    else super.onBackPressed();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) {
      getWindow().getDecorView().setSystemUiVisibility(
          View.SYSTEM_UI_FLAG_LAYOUT_STABLE
              | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
              | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_FULLSCREEN
              | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
  }

  @Override
  protected void onDestroy() {
    if (web != null) {
      web.stopLoading();
      web.destroy();
    }
    super.onDestroy();
  }
}
