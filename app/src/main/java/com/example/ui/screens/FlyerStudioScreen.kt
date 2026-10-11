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
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
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
fun FlyerStudioScreen(
  businessProfile: BusinessProfile,
  activeKeyword: String,
  aiService: GeminiAiService
) {
  val context = LocalContext.current
  val scope = rememberCoroutineScope()

  var selectedTemplate by remember { mutableStateOf(FlyerTemplateType.PROMO_RELAMPAGO) }
  var selectedColorTheme by remember { mutableStateOf(FlyerColorTheme.PURPLE_VIBE) }
  var topicInput by remember { mutableStateOf("Festival de Sobremesas Artesanais") }

  var flyerHeadline by remember { mutableStateOf("SUPER OFERTA RELÂMPAGO") }
  var flyerSubheadline by remember { mutableStateOf("Válido apenas hoje enquanto durarem os estoques!") }
  var flyerBadge by remember { mutableStateOf("30% OFF") }
  var flyerCta by remember { mutableStateOf("Comente '$activeKeyword' para receber o cupom no Direct!") }

  var isGeneratingContent by remember { mutableStateOf(false) }

  LazyColumn(
    modifier = Modifier
      .fillMaxSize()
      .padding(horizontal = 16.dp),
    contentPadding = PaddingValues(bottom = 32.dp)
  ) {
    item {
      Spacer(modifier = Modifier.height(12.dp))
      SectionHeader(
        title = "Estúdio de Flyers & Banners",
        subtitle = "Crie artes promocionais de alta conversão para publicar nos Stories e WhatsApp",
        badgeText = "Design Studio",
        icon = Icons.Default.Palette
      )

      // Painel de Configuração do Flyer
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Text("Tipo de Campanha:", style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold)
          Spacer(modifier = Modifier.height(8.dp))

          LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(FlyerTemplateType.values()) { tpl ->
              FilterChip(
                selected = selectedTemplate == tpl,
                onClick = {
                  selectedTemplate = tpl
                  val generated = com.example.service.LocalMarketingIntelligence.generateFlyerContent(
                    businessProfile,
                    topicInput,
                    tpl
                  )
                  flylineUpdate(generated, activeKeyword) { h, s, b, c ->
                    flyerHeadline = h
                    flyerSubheadline = s
                    flyerBadge = b
                    flyerCta = c
                  }
                },
                label = { Text(tpl.displayName, fontSize = 12.sp) }
              )
            }
          }

          Spacer(modifier = Modifier.height(12.dp))
          Text("Esquema de Cores do Flyer:", style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold)
          Spacer(modifier = Modifier.height(8.dp))

          LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(FlyerColorTheme.values()) { theme ->
              Surface(
                shape = RoundedCornerShape(10.dp),
                color = Color(theme.bgStart),
                modifier = Modifier
                  .border(
                    width = if (selectedColorTheme == theme) 2.dp else 0.dp,
                    color = if (selectedColorTheme == theme) Color.White else Color.Transparent,
                    shape = RoundedCornerShape(10.dp)
                  )
                  .padding(2.dp)
              ) {
                Button(
                  onClick = { selectedColorTheme = theme },
                  colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                  contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                ) {
                  Text(
                    text = theme.displayName,
                    color = Color.White,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                  )
                }
              }
            }
          }

          Spacer(modifier = Modifier.height(14.dp))

          OutlinedTextField(
            value = topicInput,
            onValueChange = { topicInput = it },
            label = { Text("Tema / Produto em Promoção") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
          )

          Spacer(modifier = Modifier.height(10.dp))

          GradientButton(
            text = "Gerar Copy do Flyer com IA",
            icon = Icons.Default.AutoAwesome,
            onClick = {
              isGeneratingContent = true
              scope.launch {
                val f = aiService.generateFlyerContent(businessProfile, topicInput, selectedTemplate)
                flyerHeadline = f.headline
                flyerSubheadline = f.subheadline
                flyerBadge = f.badgeText
                flyerCta = "Comente '$activeKeyword' para receber o link no Direct!"
                isGeneratingContent = false
                Toast.makeText(context, "Texto do flyer atualizado!", Toast.LENGTH_SHORT).show()
              }
            },
            isLoading = isGeneratingContent,
            modifier = Modifier.fillMaxWidth()
          )
        }
      }

      Spacer(modifier = Modifier.height(20.dp))
      Text(
        text = "Prévia Gráfica do Flyer (Stories / Banner 9:16):",
        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
      )
      Spacer(modifier = Modifier.height(8.dp))

      // CANVAS / VISUAL MOCK DO FLYER
      Card(
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 4.dp),
        shape = RoundedCornerShape(20.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
      ) {
        Box(
          modifier = Modifier
            .fillMaxWidth()
            .background(
              brush = Brush.verticalGradient(
                listOf(
                  Color(selectedColorTheme.bgStart),
                  Color(selectedColorTheme.bgEnd)
                )
              )
            )
            .padding(24.dp)
        ) {
          Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
          ) {
            // Top Bar da Loja
            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.Center,
              modifier = Modifier.fillMaxWidth()
            ) {
              Icon(Icons.Default.Stars, contentDescription = null, tint = Color(selectedColorTheme.accent), modifier = Modifier.size(18.dp))
              Spacer(modifier = Modifier.width(6.dp))
              Text(
                text = businessProfile.businessName.uppercase(),
                color = Color.White.copy(alpha = 0.9f),
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp,
                letterSpacing = 2.sp
              )
              Spacer(modifier = Modifier.width(6.dp))
              Icon(Icons.Default.Stars, contentDescription = null, tint = Color(selectedColorTheme.accent), modifier = Modifier.size(18.dp))
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Selo / Badge Promocional em Destaque
            Surface(
              shape = RoundedCornerShape(12.dp),
              color = Color(selectedColorTheme.accent),
              modifier = Modifier.rotate(-3f)
            ) {
              Text(
                text = flyerBadge.uppercase(),
                fontWeight = FontWeight.ExtraBold,
                fontSize = 18.sp,
                color = Color.Black,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                letterSpacing = 1.sp
              )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Headline Principal
            Text(
              text = flyerHeadline,
              color = Color.White,
              fontWeight = FontWeight.Black,
              fontSize = 24.sp,
              textAlign = TextAlign.Center,
              lineHeight = 30.sp,
              letterSpacing = 0.5.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Subheadline
            Text(
              text = flyerSubheadline,
              color = Color.White.copy(alpha = 0.85f),
              fontWeight = FontWeight.Medium,
              fontSize = 14.sp,
              textAlign = TextAlign.Center,
              lineHeight = 20.sp,
              modifier = Modifier.padding(horizontal = 8.dp)
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Caixa de Gatilho de Comentário / DM Direct
            Surface(
              shape = RoundedCornerShape(14.dp),
              color = Color.White,
              modifier = Modifier.fillMaxWidth()
            ) {
              Column(
                modifier = Modifier.padding(14.dp),
                horizontalAlignment = Alignment.CenterHorizontally
              ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                  Icon(Icons.Default.MarkChatRead, contentDescription = null, tint = PrimaryIndigo, modifier = Modifier.size(20.dp))
                  Spacer(modifier = Modifier.width(6.dp))
                  Text(
                    text = "GATILHO DE DM ATIVO",
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    color = PrimaryIndigoDark
                  )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                  text = flyerCta,
                  fontWeight = FontWeight.ExtraBold,
                  fontSize = 13.sp,
                  color = Color.Black,
                  textAlign = TextAlign.Center
                )
              }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Rodapé com Contato
            HorizontalDivider(color = Color.White.copy(alpha = 0.2f))
            Spacer(modifier = Modifier.height(10.dp))

            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.Center
            ) {
              Icon(Icons.Default.Phone, contentDescription = null, tint = Color.White.copy(alpha = 0.8f), modifier = Modifier.size(14.dp))
              Spacer(modifier = Modifier.width(4.dp))
              Text(
                text = "${businessProfile.ownerPhone} • @${businessProfile.ownerInstagram}",
                color = Color.White.copy(alpha = 0.85f),
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
              )
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(16.dp))

      // Campos Rápidos de Edição do Flyer
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Text("Editar Textos do Flyer:", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
          Spacer(modifier = Modifier.height(8.dp))

          OutlinedTextField(
            value = flyerHeadline,
            onValueChange = { flyerHeadline = it },
            label = { Text("Título Principal") },
            modifier = Modifier.fillMaxWidth()
          )
          Spacer(modifier = Modifier.height(8.dp))

          OutlinedTextField(
            value = flyerSubheadline,
            onValueChange = { flyerSubheadline = it },
            label = { Text("Subtítulo / Descrição da Oferta") },
            modifier = Modifier.fillMaxWidth()
          )
          Spacer(modifier = Modifier.height(8.dp))

          OutlinedTextField(
            value = flyerBadge,
            onValueChange = { flyerBadge = it },
            label = { Text("Texto do Selo / Desconto (ex: 30% OFF)") },
            modifier = Modifier.fillMaxWidth()
          )
          Spacer(modifier = Modifier.height(8.dp))

          OutlinedTextField(
            value = flyerCta,
            onValueChange = { flyerCta = it },
            label = { Text("Chamada para Ação / Comentário") },
            modifier = Modifier.fillMaxWidth()
          )
        }
      }

      Spacer(modifier = Modifier.height(16.dp))

      // Ações de Compartilhar
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        Button(
          onClick = {
            val shareText = """
              🎨 FLYER PROMOCIONAL: ${businessProfile.businessName}
              
              ⭐ ${flyerHeadline}
              📌 ${flyerSubheadline}
              🏷️ SELO: ${flyerBadge}
              
              👉 ${flyerCta}
              
              📲 WhatsApp: https://wa.me/${businessProfile.ownerPhone}
              📷 Instagram: @${businessProfile.ownerInstagram}
            """.trimIndent()

            val shareIntent = Intent(Intent.ACTION_SEND).apply {
              type = "text/plain"
              putExtra(Intent.EXTRA_TEXT, shareText)
            }
            context.startActivity(Intent.createChooser(shareIntent, "Compartilhar Flyer Promocional"))
          },
          colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
          shape = RoundedCornerShape(10.dp),
          modifier = Modifier.weight(1f)
        ) {
          Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
          Spacer(modifier = Modifier.width(6.dp))
          Text("Compartilhar Flyer")
        }

        OutlinedButton(
          onClick = {
            val cm = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val textToCopy = "$flyerHeadline\n$flyerSubheadline\n$flyerBadge\n$flyerCta"
            cm.setPrimaryClip(ClipData.newPlainText("Flyer", textToCopy))
            Toast.makeText(context, "Texto do flyer copiado!", Toast.LENGTH_SHORT).show()
          },
          shape = RoundedCornerShape(10.dp)
        ) {
          Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
        }
      }
    }
  }
}

private fun flylineUpdate(
  generated: FlyerDesign,
  activeKeyword: String,
  update: (String, String, String, String) -> Unit
) {
  update(
    generated.headline,
    generated.subheadline,
    generated.badgeText,
    "Comente '$activeKeyword' para receber no Direct!"
  )
}
