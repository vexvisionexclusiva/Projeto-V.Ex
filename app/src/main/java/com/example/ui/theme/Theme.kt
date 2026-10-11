package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme =
  darkColorScheme(
    primary = PrimaryIndigoLight,
    onPrimary = Color.White,
    secondary = SuccessEmeraldLight,
    onSecondary = Color.Black,
    tertiary = AccentAmber,
    background = DarkSurface,
    surface = DarkCard,
    surfaceVariant = DarkCardBorder,
  )

private val LightColorScheme =
  lightColorScheme(
    primary = PrimaryIndigo,
    onPrimary = Color.White,
    secondary = SuccessEmerald,
    onSecondary = Color.White,
    tertiary = AccentAmber,
    background = LightBackground,
    surface = LightSurface,
    surfaceVariant = LightCardBorder,
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = isSystemInDarkTheme(),
  // Keep brand consistent
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  val colorScheme =
    when {
      dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
        val context = LocalContext.current
        if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
      }
      darkTheme -> DarkColorScheme
      else -> LightColorScheme
    }

  MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
}
