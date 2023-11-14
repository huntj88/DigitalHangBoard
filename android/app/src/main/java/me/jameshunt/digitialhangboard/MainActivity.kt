package me.jameshunt.digitialhangboard

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewCompat.WebMessageListener
import androidx.webkit.WebViewFeature


class MainActivity : ComponentActivity() {
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        val myListener =
            WebMessageListener { view, message, sourceOrigin, isMainFrame, replyProxy -> // do something about view, message, sourceOrigin and isMainFrame.
                Log.d("postMessage", message.data ?: "no message data")
                if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
                    replyProxy.postMessage("Got it!")
                }
            }
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(webView, "myObject", setOf("https://digital-hang-board.vercel.app"), myListener)
        }
        setContentView(webView)
        webView.loadUrl("https://digital-hang-board.vercel.app/")
    }
}