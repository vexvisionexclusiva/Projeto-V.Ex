package com.example.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.*
import com.example.service.GeminiAiService
import com.example.ui.components.GradientButton
import com.example.ui.components.SectionHeader
import com.example.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VideoMarketingScreen(
  businessProfile: BusinessProfile,
  activeKeyword: String,
  aiService: GeminiAiService
) {
  val context = LocalContext.current
  val scope = rememberCoroutineScope()

  var productInput by remember { mutableStateOf("Combo especial da casa com sobremesa") }
  var selectedFormat by remember { mutableStateOf("Reels / TikTok (9:16)") }
  val formats = listOf("Reels / TikTok (9:16)", "YouTube Shorts", "Stories Diário")

  var isGenerating by remember { mutableStateOf(false) }
  var currentScript by remember {
    mutableStateOf(
      aiService.run {
        com.example.service.LocalMarketingIntelligence.generateVideoScript(
          businessProfile,
          "Combo Especial da Casa",
          "Reels / TikTok",
          activeKeyword
        )
      }
    )
  }

  LazyColumn(
    modifier = Modifier
      .fillMaxSize()
      .padding(horizontal = 16.dp),
    contentPadding = PaddingValues(bottom = 32.dp)
  ) {
    item {
      Spacer(modifier = Modifier.height(12.dp))
      SectionHeader(
        title = "Estúdio de Vídeos Marketing",
        subtitle = "Crie roteiros virais para Reels e TikTok que forçam comentários e disparam DMs",
        badgeText = "Roteiro & Storyboard",
        icon = Icons.Default.VideoCameraBack
      )

      // Card de Configuração do Vídeo
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Text(
            text = "Gerador de Roteiro de Vídeo com IA",
            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
          )
          Spacer(modifier = Modifier.height(10.dp))

          OutlinedTextField(
            value = productInput,
            onValueChange = { productInput = it },
            label = { Text("Produto ou Oferta do Vídeo") },
            placeholder = { Text("Ex: Bolo de pistache, Novo corte de cabelo, Kit de camisetas...") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
          )

          Spacer(modifier = Modifier.height(10.dp))

          Text("Formato do Vídeo:", style = MaterialTheme.typography.labelMedium)
          Spacer(modifier = Modifier.height(6.dp))
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            formats.forEach { fmt ->
              FilterChip(
                selected = selectedFormat == fmt,
                onClick = { selectedFormat = fmt },
                label = { Text(fmt.split(" ")[0], fontSize = 12.sp) }
              )
            }
          }

          Spacer(modifier = Modifier.height(8.dp))
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = PrimaryIndigo.copy(alpha = 0.08f),
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              modifier = Modifier.padding(10.dp)
            ) {
              Icon(Icons.Default.Tag, contentDescription = null, tint = PrimaryIndigo, modifier = Modifier.size(16.dp))
              Spacer(modifier = Modifier.width(6.dp))
              Text(
                text = "Gatilho de Comentário integrado: #$activeKeyword",
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                color = PrimaryIndigoDark
              )
            }
          }

          Spacer(modifier = Modifier.height(12.dp))

          GradientButton(
            text = "Gerar Roteiro Viral & Storyboard",
            icon = Icons.Default.AutoAwesome,
            onClick = {
              if (productInput.isNotBlank()) {
                isGenerating = true
                scope.launch {
                  currentScript = aiService.generateVideoScript(
                    business = businessProfile,
                    product = productInput,
                    format = selectedFormat,
                    keyword = activeKeyword
                  )
                  isGenerating = false
                  Toast.makeText(context, "Roteiro gerado com sucesso!", Toast.LENGTH_SHORT).show()
                }
              }
            },
            isLoading = isGenerating,
            modifier = Modifier.fillMaxWidth()
          )
        }
      }

      Spacer(modifier = Modifier.height(20.dp))

      // CARD DO ROTEIRO
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
          ) {
            Text(
              text = currentScript.title,
              style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
              fontSize = 16.sp,
              modifier = Modifier.weight(1f)
            )
            Surface(
              shape = CircleShape,
              color = AccentCoral.copy(alpha = 0.15f),
              contentColor = AccentCoral
            ) {
              Text(
                text = currentScript.format,
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
              )
            }
          }

          Spacer(modifier = Modifier.height(14.dp))

          // HOOK (Gancho 0-3s)
          Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = AccentAmber.copy(alpha = 0.12f)),
            border = CardDefaults.outlinedCardBorder().copy(brush = Brush.horizontalGradient(listOf(AccentAmber, Color(0xFFFBBF24))))
          ) {
            Column(modifier = Modifier.padding(12.dp)) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.FlashOn, contentDescription = null, tint = AccentAmber, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                  text = "GANCHO (0 a 3 segundos) - Reter o seguidor:",
                  fontWeight = FontWeight.Bold,
                  fontSize = 12.sp,
                  color = Color(0xFFB45309)
                )
              }
              Spacer(modifier = Modifier.height(4.dp))
              Text(
                text = "\"${currentScript.hook}\"",
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
              )
            }
          }

          Spacer(modifier = Modifier.height(14.dp))
          Text(
            text = "Storyboard & Cenas Cronometradas:",
            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
          )
        }
      }

      Spacer(modifier = Modifier.height(8.dp))
    }

    // Storyboard Scenes
    items(currentScript.scenes) { scene ->
      Card(
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 4.dp),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
      ) {
        Column(modifier = Modifier.padding(14.dp)) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
              Box(
                modifier = Modifier
                  .size(26.dp)
                  .clip(CircleShape)
                  .background(PrimaryIndigo),
                contentAlignment = Alignment.Center
              ) {
                Text(
                  text = "${scene.sceneNumber}",
                  color = Color.White,
                  fontWeight = FontWeight.Bold,
                  fontSize = 12.sp
                )
              }
              Spacer(modifier = Modifier.width(8.dp))
              Text(
                text = "Cena ${scene.sceneNumber} (${scene.durationSeconds}s)",
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp
              )
            }

            Surface(
              shape = RoundedCornerShape(6.dp),
              color = MaterialTheme.colorScheme.surfaceVariant,
              modifier = Modifier.padding(2.dp)
            ) {
              Text(
                text = "Texto na tela: \"${scene.onScreenText}\"",
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
              )
            }
          }

          Spacer(modifier = Modifier.height(8.dp))
          Text(
            text = "🎬 Câmera: ${scene.visualAction}",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f)
          )
          Spacer(modifier = Modifier.height(4.dp))
          Text(
            text = "🎙️ Fala: \"${scene.spokenText}\"",
            style = MaterialTheme.typography.bodySmall,
            fontWeight = FontWeight.Medium
          )
        }
      }
    }

    // Call to Action & Legenda
    item {
      Spacer(modifier = Modifier.height(10.dp))
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.Campaign, contentDescription = null, tint = SuccessEmerald, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("Chamada para Ação (CTA de Fechamento):", fontWeight = FontWeight.Bold, fontSize = 14.sp)
          }
          Spacer(modifier = Modifier.height(6.dp))
          Text(
            text = currentScript.callToAction,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = SuccessEmeraldDark
          )

          Spacer(modifier = Modifier.height(12.dp))
          HorizontalDivider()
          Spacer(modifier = Modifier.height(12.dp))

          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
          ) {
            Text("Legenda Pronta com Hashtags:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
            IconButton(
              onClick = {
                val cm = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                cm.setPrimaryClip(ClipData.newPlainText("Legenda", currentScript.caption))
                Toast.makeText(context, "Legenda copiada para a área de transferência!", Toast.LENGTH_SHORT).show()
              }
            ) {
              Icon(Icons.Default.ContentCopy, contentDescription = null, tint = PrimaryIndigo)
            }
          }

          Surface(
            shape = RoundedCornerShape(10.dp),
            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
            modifier = Modifier.fillMaxWidth()
          ) {
            Text(
              text = currentScript.caption,
              style = MaterialTheme.typography.bodySmall,
              modifier = Modifier.padding(12.dp),
              lineHeight = 18.sp
            )
          }

          Spacer(modifier = Modifier.height(14.dp))

          // Compartilhar roteiro
          Button(
            onClick = {
              val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(
                  Intent.EXTRA_TEXT,
                  "ROTEIRO DE VÍDEO MARKETING:\n${currentScript.title}\n\nGANCHO:\n${currentScript.hook}\n\nCTA:\n${currentScript.callToAction}\n\nLEGENDA:\n${currentScript.caption}"
                )
              }
              context.startActivity(Intent.createChooser(shareIntent, "Compartilhar Roteiro"))
            },
            shape = RoundedCornerShape(10.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
            modifier = Modifier.fillMaxWidth()
          ) {
            Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(6.dp))
            Text("Compartilhar Roteiro Completo")
          }
        }
      }
    }
  }
}
