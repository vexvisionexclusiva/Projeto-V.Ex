package com.example.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
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
import com.example.ui.components.MetricStatCard
import com.example.ui.components.SectionHeader
import com.example.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun ProductExpansionScreen(
  businessProfile: BusinessProfile,
  expansionIdeas: List<ProductExpansionIdea>,
  onUpdateIdeas: (List<ProductExpansionIdea>) -> Unit,
  aiService: GeminiAiService
) {
  val context = LocalContext.current
  val scope = rememberCoroutineScope()
  var isGenerating by remember { mutableStateOf(false) }
  var objectiveInput by remember { mutableStateOf("Quero aumentar meu ticket médio e criar produtos que vendem no final de semana") }

  // Calculator state
  var calcCost by remember { mutableStateOf("25") }
  var calcPrice by remember { mutableStateOf("69.90") }
  var calcUnits by remember { mutableStateOf("40") }

  val costVal = calcCost.toDoubleOrNull() ?: 0.0
  val priceVal = calcPrice.toDoubleOrNull() ?: 0.0
  val unitsVal = calcUnits.toIntOrNull() ?: 0

  val profitPerUnit = (priceVal - costVal).coerceAtLeast(0.0)
  val marginPercent = if (priceVal > 0) ((profitPerUnit / priceVal) * 100).toInt() else 0
  val totalMonthlyProfit = profitPerUnit * unitsVal

  LazyColumn(
    modifier = Modifier
      .fillMaxSize()
      .padding(horizontal = 16.dp),
    contentPadding = PaddingValues(bottom = 32.dp)
  ) {
    item {
      Spacer(modifier = Modifier.height(12.dp))
      SectionHeader(
        title = "Expansão de Produtos & Negócios",
        subtitle = "Descubra novas linhas lucrativas, kits de alto ticket e oportunidades no seu nicho",
        badgeText = "Estratégia IA",
        icon = Icons.Default.TrendingUp
      )

      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
      ) {
        MetricStatCard(
          title = "Margem Típica",
          value = "64%",
          subtitle = "Novas linhas",
          icon = Icons.Default.MonetizationOn,
          accentColor = SuccessEmerald,
          modifier = Modifier.weight(1f)
        )
        MetricStatCard(
          title = "Ticket Médio",
          value = "+48%",
          subtitle = "Com combos",
          icon = Icons.Default.ShoppingBag,
          accentColor = PrimaryIndigo,
          modifier = Modifier.weight(1f)
        )
        MetricStatCard(
          title = "Nicho Atual",
          value = businessProfile.niche.displayName.split(" ")[0],
          subtitle = businessProfile.city.split(",")[0],
          icon = Icons.Default.Storefront,
          accentColor = AccentAmber,
          modifier = Modifier.weight(1f)
        )
      }

      Spacer(modifier = Modifier.height(12.dp))

      // Card de Gerar com IA
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(PrimaryIndigo.copy(alpha = 0.12f)),
              contentAlignment = Alignment.Center
            ) {
              Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = PrimaryIndigo, modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
              Text(
                text = "Gerador de Ideias de Expansão com IA",
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp
              )
              Text(
                text = "Baseado em ${businessProfile.businessName} (${businessProfile.niche.displayName})",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
              )
            }
          }

          Spacer(modifier = Modifier.height(14.dp))

          OutlinedTextField(
            value = objectiveInput,
            onValueChange = { objectiveInput = it },
            label = { Text("Qual o seu objetivo principal no negócio?") },
            placeholder = { Text("Ex: Vender combos de final de semana, atrair clientes corporativos...") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
          )

          Spacer(modifier = Modifier.height(12.dp))

          GradientButton(
            text = "Gerar Novas Linhas de Produto",
            icon = Icons.Default.Lightbulb,
            onClick = {
              isGenerating = true
              scope.launch {
                val newIdeas = aiService.generateExpansionIdeas(businessProfile, objectiveInput)
                onUpdateIdeas(newIdeas)
                isGenerating = false
                Toast.makeText(context, "3 novas ideias estratégicas geradas!", Toast.LENGTH_SHORT).show()
              }
            },
            isLoading = isGenerating,
            modifier = Modifier.fillMaxWidth()
          )
        }
      }

      Spacer(modifier = Modifier.height(20.dp))
      Text(
        text = "Ideias Estratégicas para o seu Catálogo:",
        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
      )
      Spacer(modifier = Modifier.height(8.dp))
    }

    // Lista de Ideias
    items(expansionIdeas) { idea ->
      Card(
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 6.dp),
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
            Surface(
              shape = CircleShape,
              color = PrimaryIndigo.copy(alpha = 0.12f),
              contentColor = PrimaryIndigo
            ) {
              Text(
                text = idea.category,
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
              )
            }

            Surface(
              shape = CircleShape,
              color = SuccessEmerald.copy(alpha = 0.15f),
              contentColor = SuccessEmeraldDark
            ) {
              Text(
                text = "Margem: ${idea.estimatedMargin}",
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
              )
            }
          }

          Spacer(modifier = Modifier.height(10.dp))

          Text(
            text = idea.title,
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            fontSize = 16.sp
          )
          Spacer(modifier = Modifier.height(4.dp))
          Text(
            text = idea.description,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.85f),
            lineHeight = 20.sp
          )

          Spacer(modifier = Modifier.height(12.dp))

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Column {
              Text("Preço Sugerido", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
              Text(idea.suggestedPrice, fontWeight = FontWeight.Bold, color = SuccessEmeraldDark)
            }
            Column {
              Text("Público-Alvo", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
              Text(idea.targetAudience, fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
            }
          }

          Spacer(modifier = Modifier.height(10.dp))
          HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)
          Spacer(modifier = Modifier.height(10.dp))

          Row(verticalAlignment = Alignment.Top) {
            Icon(Icons.Default.RocketLaunch, contentDescription = null, tint = AccentAmber, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(6.dp))
            Column {
              Text("Estratégia de Lançamento em 7 Dias:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
              Text(idea.launchStrategy, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f))
            }
          }
        }
      }
    }

    // CALCULADORA DE MARGEM & METAS
    item {
      Spacer(modifier = Modifier.height(24.dp))
      Text(
        text = "Calculadora Rápida de Lucro & Projeção",
        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
      )
      Spacer(modifier = Modifier.height(8.dp))

      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            OutlinedTextField(
              value = calcCost,
              onValueChange = { calcCost = it },
              label = { Text("Custo (R$)") },
              modifier = Modifier.weight(1f),
              singleLine = true
            )
            OutlinedTextField(
              value = calcPrice,
              onValueChange = { calcPrice = it },
              label = { Text("Venda (R$)") },
              modifier = Modifier.weight(1f),
              singleLine = true
            )
            OutlinedTextField(
              value = calcUnits,
              onValueChange = { calcUnits = it },
              label = { Text("Qtd/Mês") },
              modifier = Modifier.weight(1f),
              singleLine = true
            )
          }

          Spacer(modifier = Modifier.height(16.dp))

          Surface(
            shape = RoundedCornerShape(12.dp),
            color = SuccessEmerald.copy(alpha = 0.12f),
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
              horizontalArrangement = Arrangement.SpaceAround,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Lucro Líquido p/ Unidade", style = MaterialTheme.typography.labelSmall)
                Text(
                  text = "R$ ${"%.2f".format(profitPerUnit)}",
                  fontWeight = FontWeight.Bold,
                  fontSize = 16.sp,
                  color = SuccessEmeraldDark
                )
              }

              Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Margem", style = MaterialTheme.typography.labelSmall)
                Text(
                  text = "$marginPercent%",
                  fontWeight = FontWeight.Bold,
                  fontSize = 16.sp,
                  color = PrimaryIndigo
                )
              }

              Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Lucro Mensal Estimado", style = MaterialTheme.typography.labelSmall)
                Text(
                  text = "R$ ${"%.2f".format(totalMonthlyProfit)}",
                  fontWeight = FontWeight.Bold,
                  fontSize = 17.sp,
                  color = SuccessEmeraldDark
                )
              }
            }
          }
        }
      }
    }
  }
}
