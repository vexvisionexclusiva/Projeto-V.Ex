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
fun AdsGeneratorScreen(
  businessProfile: BusinessProfile,
  aiService: GeminiAiService
) {
  val context = LocalContext.current
  val scope = rememberCoroutineScope()

  var productOfferInput by remember { mutableStateOf("Desconto especial de inauguração e entrega grátis no primeiro pedido") }
  var selectedPlatform by remember { mutableStateOf("Meta Ads (Instagram & FB)") }
  val platforms = listOf("Meta Ads (Instagram & FB)", "TikTok Ads", "Google Ads / WhatsApp")

  var isGenerating by remember { mutableStateOf(false) }
  var currentAd by remember {
    mutableStateOf(
      aiService.run {
        com.example.service.LocalMarketingIntelligence.generateAdCampaign(
          businessProfile,
          "Oferta Especial de Lançamento",
          "Meta Ads"
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
        title = "Gerador de Anúncios de Alto Impacto",
        subtitle = "Textos magnéticos e segmentações para atrair clientes locais da sua cidade",
        badgeText = "Copywriting IA",
        icon = Icons.Default.Campaign
      )

      // Configuração
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Text(
            text = "Configurar Anúncio Promocional",
            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
          )
          Spacer(modifier = Modifier.height(10.dp))

          OutlinedTextField(
            value = productOfferInput,
            onValueChange = { productOfferInput = it },
            label = { Text("Qual produto ou oferta quer anunciar?") },
            placeholder = { Text("Ex: Rodízio com preço promocional, Kit de manicure, Roupas de verão...") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
          )

          Spacer(modifier = Modifier.height(10.dp))
          Text("Plataforma de Veiculação:", style = MaterialTheme.typography.labelMedium)
          Spacer(modifier = Modifier.height(6.dp))
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            platforms.forEach { p ->
              FilterChip(
                selected = selectedPlatform == p,
                onClick = { selectedPlatform = p },
                label = { Text(p.split(" ")[0], fontSize = 12.sp) }
              )
            }
          }

          Spacer(modifier = Modifier.height(12.dp))

          GradientButton(
            text = "Gerar Anúncio & Segmentação",
            icon = Icons.Default.AutoAwesome,
            onClick = {
              if (productOfferInput.isNotBlank()) {
                isGenerating = true
                scope.launch {
                  currentAd = aiService.generateAdCampaign(
                    business = businessProfile,
                    product = productOfferInput,
                    platform = selectedPlatform
                  )
                  isGenerating = false
                  Toast.makeText(context, "Anúncio gerado com sucesso!", Toast.LENGTH_SHORT).show()
                }
              }
            },
            isLoading = isGenerating,
            modifier = Modifier.fillMaxWidth()
          )
        }
      }

      Spacer(modifier = Modifier.height(20.dp))
      Text(
        text = "Prévia do Anúncio Patrocinado:",
        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
      )
      Spacer(modifier = Modifier.height(8.dp))

      // MOCK VISUAL DO ANÚNCIO (Instagram/Facebook)
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          // Top bar do anúncio
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
              Box(
                modifier = Modifier
                  .size(36.dp)
                  .clip(CircleShape)
                  .background(PrimaryIndigo),
                contentAlignment = Alignment.Center
              ) {
                Text(
                  text = businessProfile.businessName.take(1),
                  color = Color.White,
                  fontWeight = FontWeight.Bold,
                  fontSize = 16.sp
                )
              }
              Spacer(modifier = Modifier.width(10.dp))
              Column {
                Text(
                  text = businessProfile.businessName,
                  fontWeight = FontWeight.Bold,
                  fontSize = 14.sp
                )
                Text(
                  text = "Patrocinado • ${businessProfile.city}",
                  style = MaterialTheme.typography.labelSmall,
                  color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
              }
            }

            Icon(Icons.Default.MoreVert, contentDescription = null, tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f))
          }

          Spacer(modifier = Modifier.height(12.dp))

          // Imagem placeholder do anúncio com gradient
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = PrimaryIndigo.copy(alpha = 0.1f),
            modifier = Modifier
              .fillMaxWidth()
              .height(140.dp)
          ) {
            Box(
              modifier = Modifier
                .fillMaxSize()
                .background(
                  brush = androidx.compose.ui.graphics.Brush.linearGradient(
                    listOf(PrimaryIndigoLight.copy(alpha = 0.2f), SuccessEmeraldLight.copy(alpha = 0.2f))
                  )
                ),
              contentAlignment = Alignment.Center
            ) {
              Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.Storefront, contentDescription = null, tint = PrimaryIndigo, modifier = Modifier.size(36.dp))
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                  text = currentAd.headline,
                  fontWeight = FontWeight.Bold,
                  fontSize = 15.sp,
                  color = PrimaryIndigoDark
                )
              }
            }
          }

          Spacer(modifier = Modifier.height(12.dp))

          // Headline
          Text(
            text = currentAd.headline,
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            fontSize = 16.sp
          )

          Spacer(modifier = Modifier.height(6.dp))

          // Primary text
          Text(
            text = currentAd.primaryText,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.85f),
            lineHeight = 20.sp
          )

          Spacer(modifier = Modifier.height(14.dp))

          // Botão CTA do Anúncio
          Button(
            onClick = {
              Toast.makeText(context, "Ação do anúncio: ${currentAd.callToAction}", Toast.LENGTH_SHORT).show()
            },
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.fillMaxWidth()
          ) {
            Text(currentAd.callToAction, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.width(6.dp))
            Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
          }
        }
      }

      Spacer(modifier = Modifier.height(16.dp))

      // SEGMENTAÇÃO SUGERIDA
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.LocationOn, contentDescription = null, tint = AccentAmber, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("Segmentação Recomendada para Tráfego Pago:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
          }

          Spacer(modifier = Modifier.height(8.dp))
          Text(
            text = currentAd.audienceTargeting,
            style = MaterialTheme.typography.bodySmall,
            lineHeight = 18.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
          )

          Spacer(modifier = Modifier.height(12.dp))
          Text("Pontos de Valor / Diferenciais:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
          Spacer(modifier = Modifier.height(6.dp))
        }
      }

      Spacer(modifier = Modifier.height(8.dp))
    }

    items(currentAd.sellingPoints) { point ->
      Card(
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 3.dp),
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f))
      ) {
        Row(
          verticalAlignment = Alignment.CenterVertically,
          modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
          Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SuccessEmerald, modifier = Modifier.size(16.dp))
          Spacer(modifier = Modifier.width(8.dp))
          Text(text = point, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Medium)
        }
      }
    }

    item {
      Spacer(modifier = Modifier.height(12.dp))
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        Button(
          onClick = {
            val cm = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val textToCopy = "TÍTULO:\n${currentAd.headline}\n\nTEXTO PRINCIPAL:\n${currentAd.primaryText}\n\nCTA:\n${currentAd.callToAction}\n\nPÚBLICO:\n${currentAd.audienceTargeting}"
            cm.setPrimaryClip(ClipData.newPlainText("Anúncio", textToCopy))
            Toast.makeText(context, "Anúncio completo copiado!", Toast.LENGTH_SHORT).show()
          },
          colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
          shape = RoundedCornerShape(10.dp),
          modifier = Modifier.weight(1f)
        ) {
          Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
          Spacer(modifier = Modifier.width(6.dp))
          Text("Copiar Texto Completo")
        }

        OutlinedButton(
          onClick = {
            val share = Intent(Intent.ACTION_SEND).apply {
              type = "text/plain"
              putExtra(Intent.EXTRA_TEXT, "ANÚNCIO PARA ${currentAd.platform}:\n\n${currentAd.headline}\n\n${currentAd.primaryText}\n\nCTA: ${currentAd.callToAction}")
            }
            context.startActivity(Intent.createChooser(share, "Compartilhar Anúncio"))
          },
          shape = RoundedCornerShape(10.dp)
        ) {
          Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
        }
      }
    }
  }
}
