package ma.etafat.vroffline;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Starts the on-device server, then opens the experience in the Quest Browser (the only Quest
 * engine with immersive WebXR). 127.0.0.1 is a secure context, so "Enter VR" works fully offline.
 */
public class MainActivity extends Activity {
    static final String URL = "http://127.0.0.1:" + LocalServer.PORT + "/xr/index.html";
    private final Handler ui = new Handler(Looper.getMainLooper());
    private TextView status;
    private boolean autoLaunched = false;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        startForegroundService(new Intent(this, LocalServer.class));

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setPadding(80, 60, 80, 60);
        GradientDrawable bg = new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, new int[]{0xFF0D2740, 0xFF081726});
        root.setBackground(bg);

        ImageView logo = new ImageView(this);
        logo.setImageResource(R.mipmap.ic_launcher);
        root.addView(logo, new LinearLayout.LayoutParams(220, 220));

        TextView title = new TextView(this);
        title.setText("ETAFAT VR");
        title.setTextColor(Color.WHITE);
        title.setTextSize(40);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 30, 0, 6);
        root.addView(title);

        TextView sub = new TextView(this);
        sub.setText("Expérience immersive — fonctionne sans internet");
        sub.setTextColor(0xFF8EE6E4);
        sub.setTextSize(18);
        sub.setGravity(Gravity.CENTER);
        root.addView(sub);

        Button launch = new Button(this);
        launch.setText("Lancer l'expérience");
        launch.setTextColor(Color.WHITE);
        launch.setTextSize(20);
        launch.setAllCaps(false);
        GradientDrawable pill = new GradientDrawable();
        pill.setColor(0xFF2AB5B4);
        pill.setCornerRadius(80);
        launch.setBackground(pill);
        launch.setPadding(70, 26, 70, 26);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lp.topMargin = 50;
        root.addView(launch, lp);
        launch.setOnClickListener(v -> openWhenReady(0));

        status = new TextView(this);
        status.setTextColor(0x99FFFFFF);
        status.setTextSize(14);
        status.setGravity(Gravity.CENTER);
        status.setPadding(0, 30, 0, 0);
        status.setText("Démarrage du serveur local…");
        root.addView(status);

        TextView hint = new TextView(this);
        hint.setText("Dans le navigateur, appuyez sur « Enter VR ».");
        hint.setTextColor(0x77FFFFFF);
        hint.setTextSize(14);
        hint.setGravity(Gravity.CENTER);
        hint.setPadding(0, 10, 0, 0);
        root.addView(hint);

        setContentView(root);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (!autoLaunched) { autoLaunched = true; openWhenReady(0); }
    }

    private void openWhenReady(int attempt) {
        if (!LocalServer.running) {
            if (attempt > 40) { status.setText("Le serveur local n'a pas démarré — relancez l'application."); return; }
            ui.postDelayed(() -> openWhenReady(attempt + 1), 150);
            return;
        }
        status.setText("Serveur local prêt · " + URL);
        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(URL));
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        i.setPackage("com.oculus.browser");
        try {
            startActivity(i);
        } catch (ActivityNotFoundException e) {
            i.setPackage(null);
            try { startActivity(i); } catch (ActivityNotFoundException e2) { status.setText("Navigateur introuvable sur cet appareil."); }
        }
    }
}
