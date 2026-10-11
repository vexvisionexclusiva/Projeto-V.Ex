package com.example.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.*
import com.example.service.GeminiAiService
import com.example.ui.components.GradientButton
import com.example.ui.components.MetricStatCard
import com.example.ui.components.SectionHeader
import com.example.ui.theme.*
import kotlinx.coroutines.launch
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SocialAutomationScreen(
  businessProfile: BusinessProfile,
  rules: List<CommentRule>,
  leads: List<LeadRecord>,
  onAddRule: (CommentRule) -> Unit,
  onToggleRule: (String) -> Unit,
  onDeleteRule: (String) -> Unit,
  onNewLeadGenerated: (LeadRecord) -> Unit,
  aiService: GeminiAiService
) {
  val context = LocalContext.current
  val scope = rememberCoroutineScope()
  var selectedTab by remember { mutableIntStateOf(0) } // 0 = Simulador, 1 = Palavras-Chave, 2 = Assistente IA, 3 = Leads
  val tabs = listOf("Simulador Interativo", "Palavras-Chave", "Gerador de Respostas", "Leads & DMs")

  // Simulator state
  var simulatorInput by remember { mutableStateOf("") }
  var isProcessingComment by remember { mutableStateOf(false) }
  var simulatedPublicReply by remember { mutableStateOf<String?>(null) }
  var triggeredRule by remember { mutableStateOf<CommentRule?>(null) }
  var simulatedUserName by remember { mutableStateOf("cliente_mariana") }

  // Manual Assistant state
  var manualCommentInput by remember { mutableStateOf("") }
  var isGeneratingVariants by remember { mutableStateOf(false) }
  var manualVariants by remember { mutableStateOf<List<Pair<String, String>>>(emptyList()) }

  // Add rule dialog
  var showAddRuleDialog by remember { mutableStateOf(false) }

  LazyColumn(
    modifier = Modifier
      .fillMaxSize()
      .padding(horizontal = 16.dp),
    contentPadding = PaddingValues(bottom = 32.dp)
  ) {
    // Header & KPI Metrics
    item {
      Spacer(modifier = Modifier.height(12.dp))
      SectionHeader(
        title = "Automação Social & Funil DM",
        subtitle = "IA respondendo comentários e reencaminhando clientes direto para o seu WhatsApp/DM",
        badgeText = "IA Ativa",
        icon = Icons.Default.Bolt
      )

      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
      ) {
        MetricStatCard(
          title = "DMs Enviadas",
          value = "${leads.size + 38}",
          subtitle = "+12 hoje",
          icon = Icons.Default.Send,
          accentColor = PrimaryIndigo,
          modifier = Modifier.weight(1f)
        )
        MetricStatCard(
          title = "Taxa Conversão",
          value = "41.8%",
          subtitle = "Alta Tração",
          icon = Icons.Default.TrendingUp,
          accentColor = SuccessEmerald,
          modifier = Modifier.weight(1f)
        )
        MetricStatCard(
          title = "Gatilhos Ativos",
          value = "${rules.count { it.isActive }}",
          subtitle = "Palavras-chave",
          icon = Icons.Default.Tag,
          accentColor = AccentAmber,
          modifier = Modifier.weight(1f)
        )
      }

      Spacer(modifier = Modifier.height(8.dp))

      // Tab selector
      PrimaryScrollableTabRow(
        selectedTabIndex = selectedTab,
        edgePadding = 0.dp,
        containerColor = MaterialTheme.colorScheme.surface,
        contentColor = PrimaryIndigo
      ) {
        tabs.forEachIndexed { index, title ->
          Tab(
            selected = selectedTab == index,
            onClick = { selectedTab = index },
            text = {
              Text(
                text = title,
                fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Medium,
                fontSize = 13.sp
              )
            }
          )
        }
      }

      Spacer(modifier = Modifier.height(16.dp))
    }

    when (selectedTab) {
      0 -> {
        // SIMULADOR INTERATIVO
        item {
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
                Row(verticalAlignment = Alignment.CenterVertically) {
                  Box(
                    modifier = Modifier
                      .size(40.dp)
                      .clip(CircleShape)
                      .background(
                        Brush.linearGradient(
                          listOf(InstagramGradientStart, InstagramGradientMid, InstagramGradientEnd)
                        )
                      ),
                    contentAlignment = Alignment.Center
                  ) {
                    Icon(
                      imageVector = Icons.Default.CameraAlt,
                      contentDescription = null,
                      tint = Color.White,
                      modifier = Modifier.size(22.dp)
                    )
                  }
                  Spacer(modifier = Modifier.width(10.dp))
                  Column {
                    Text(
                      text = "@${businessProfile.ownerInstagram}",
                      style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                    )
                    Text(
                      text = "Post do Feed • Simulador em Tempo Real",
                      style = MaterialTheme.typography.labelSmall,
                      color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                  }
                }

                Surface(
                  shape = CircleShape,
                  color = SuccessEmerald.copy(alpha = 0.15f),
                  contentColor = SuccessEmeraldDark
                ) {
                  Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                  ) {
                    Box(
                      modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(SuccessEmerald)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                      text = "Robô Ouvindo",
                      style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                    )
                  }
                }
              }

              Spacer(modifier = Modifier.height(14.dp))

              // Post Mock
              Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f))
              ) {
                Column(modifier = Modifier.padding(12.dp)) {
                  Text(
                    text = "🔥 SUPER LANÇAMENTO DA SEMANA!",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                  )
                  Spacer(modifier = Modifier.height(4.dp))
                  Text(
                    text = "Quer garantir as melhores condições com desconto exclusivo? Comente '${rules.firstOrNull { it.isActive }?.keyword ?: "QUERO"}' que enviamos o link direto no seu direct!",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.85f)
                  )
                }
              }

              Spacer(modifier = Modifier.height(16.dp))

              Text(
                text = "Comentários Rápidos de Teste:",
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.SemiBold
              )
              Spacer(modifier = Modifier.height(8.dp))

              val sampleComments = listOf(
                "QUERO",
                "Qual o PREÇO?",
                "Tem o CARDAPIO disponível?",
                "Vocês entregam hoje?",
                "PROMO ativa?",
                "Como funciona o atendimento?"
              )

              LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
              ) {
                items(sampleComments) { sample ->
                  SuggestionChip(
                    onClick = { simulatorInput = sample },
                    label = { Text(sample, fontSize = 12.sp) }
                  )
                }
              }

              Spacer(modifier = Modifier.height(12.dp))

              OutlinedTextField(
                value = simulatorInput,
                onValueChange = { simulatorInput = it },
                label = { Text("Digite o comentário do internauta...") },
                placeholder = { Text("Ex: Eu quero saber o preço e como comprar!") },
                leadingIcon = {
                  Icon(Icons.Default.ChatBubbleOutline, contentDescription = null)
                },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
              )

              Spacer(modifier = Modifier.height(12.dp))

              GradientButton(
                text = "Simular Comentário & IA",
                icon = Icons.AutoMirrored.Filled.Send,
                onClick = {
                  if (simulatorInput.isNotBlank()) {
                    isProcessingComment = true
                    scope.launch {
                      val upper = simulatorInput.uppercase()
                      // Detect matching rule
                      val matched = rules.firstOrNull { it.isActive && upper.contains(it.keyword.uppercase()) }
                      triggeredRule = matched

                      val reply = aiService.generateCommentReply(
                        business = businessProfile,
                        commentText = simulatorInput,
                        matchedKeyword = matched?.keyword
                      )
                      simulatedPublicReply = reply
                      isProcessingComment = false

                      // If keyword matched, generate lead
                      if (matched != null) {
                        val newLead = LeadRecord(
                          id = UUID.randomUUID().toString(),
                          username = "@$simulatedUserName",
                          commentText = simulatorInput,
                          matchedKeyword = matched.keyword,
                          status = LeadStatus.DM_DISPARADA,
                          dmSent = matched.dmMessage
                        )
                        onNewLeadGenerated(newLead)
                        Toast.makeText(context, "Palavra '${matched.keyword}' detectada! DM disparada!", Toast.LENGTH_SHORT).show()
                      }
                    }
                  }
                },
                isLoading = isProcessingComment,
                modifier = Modifier.fillMaxWidth()
              )
            }
          }

          // Resposta Pública da IA & Disparo de DM
          AnimatedVisibility(
            visible = simulatedPublicReply != null,
            enter = fadeIn() + expandVertically()
          ) {
            Column(modifier = Modifier.padding(top = 16.dp)) {
              // Resposta pública simulada
              Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = PrimaryIndigo.copy(alpha = 0.08f)),
                border = CardDefaults.outlinedCardBorder().copy(brush = Brush.horizontalGradient(listOf(PrimaryIndigo, PrimaryIndigoLight)))
              ) {
                Column(modifier = Modifier.padding(14.dp)) {
                  Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                      imageVector = Icons.Default.SmartToy,
                      contentDescription = null,
                      tint = PrimaryIndigo,
                      modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                      text = "Resposta Pública da IA gerada no Comentário:",
                      fontWeight = FontWeight.Bold,
                      fontSize = 13.sp,
                      color = PrimaryIndigoDark
                    )
                  }
                  Spacer(modifier = Modifier.height(8.dp))
                  Text(
                    text = simulatedPublicReply ?: "",
                    fontSize = 14.sp,
                    lineHeight = 20.sp,
                    fontWeight = FontWeight.Medium
                  )
                }
              }

              // Card de Envio Direto de DM
              if (triggeredRule != null) {
                val rule = triggeredRule!!
                Spacer(modifier = Modifier.height(12.dp))
                Card(
                  modifier = Modifier.fillMaxWidth(),
                  shape = RoundedCornerShape(16.dp),
                  colors = CardDefaults.cardColors(containerColor = SuccessEmerald.copy(alpha = 0.1f)),
                  border = CardDefaults.outlinedCardBorder().copy(brush = Brush.horizontalGradient(listOf(SuccessEmerald, SuccessEmeraldLight)))
                ) {
                  Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                      verticalAlignment = Alignment.CenterVertically,
                      horizontalArrangement = Arrangement.SpaceBetween,
                      modifier = Modifier.fillMaxWidth()
                    ) {
                      Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                          modifier = Modifier
                            .size(34.dp)
                            .clip(CircleShape)
                            .background(WhatsAppGreen),
                          contentAlignment = Alignment.Center
                        ) {
                          Icon(
                            imageVector = Icons.Default.MarkChatRead,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                          )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                          Text(
                            text = "Gatilho '${rule.keyword}' Acionado!",
                            fontWeight = FontWeight.Bold,
                            color = SuccessEmeraldDark,
                            fontSize = 14.sp
                          )
                          Text(
                            text = "DM Direta Enviada para @$simulatedUserName",
                            style = MaterialTheme.typography.labelSmall
                          )
                        }
                      }

                      Surface(
                        shape = CircleShape,
                        color = SuccessEmerald,
                        contentColor = Color.White
                      ) {
                        Text(
                          text = "100% Automático",
                          style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                          modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                      }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                      text = "Mensagem Privada Disparada:",
                      style = MaterialTheme.typography.labelSmall,
                      fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                      text = rule.dmMessage,
                      style = MaterialTheme.typography.bodyMedium,
                      fontSize = 13.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Direct Link Action
                    val directUrl = if (rule.directLinkUrl.isNotBlank()) {
                      rule.directLinkUrl
                    } else {
                      "https://wa.me/${businessProfile.ownerPhone}?text=Ol%C3%A1!+Comentei+${rule.keyword}+no+post+e+quero+mais+informa%C3%A7%C3%B5es!"
                    }

                    Row(
                      modifier = Modifier.fillMaxWidth(),
                      horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                      Button(
                        onClick = {
                          try {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(directUrl))
                            context.startActivity(intent)
                          } catch (_: Exception) {
                            Toast.makeText(context, "Abrindo link: $directUrl", Toast.LENGTH_SHORT).show()
                          }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = WhatsAppGreen),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                      ) {
                        Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Chamar no WhatsApp", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                      }

                      OutlinedButton(
                        onClick = {
                          val cm = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                          cm.setPrimaryClip(ClipData.newPlainText("Link", directUrl))
                          Toast.makeText(context, "Link de atendimento copiado!", Toast.LENGTH_SHORT).show()
                        },
                        shape = RoundedCornerShape(10.dp)
                      ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      1 -> {
        // GESTÃO DE PALAVRAS-CHAVE
        item {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
          ) {
            Column {
              Text(
                text = "Regras de Gatilhos Automáticos",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
              )
              Text(
                text = "Palavras que ativam o reencaminho direto para DM",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
              )
            }
            Button(
              onClick = { showAddRuleDialog = true },
              shape = RoundedCornerShape(10.dp),
              colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo)
            ) {
              Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
              Spacer(modifier = Modifier.width(4.dp))
              Text("Nova Palavra", fontSize = 12.sp)
            }
          }
          Spacer(modifier = Modifier.height(12.dp))
        }

        items(rules) { rule ->
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 6.dp),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
          ) {
            Column(modifier = Modifier.padding(16.dp)) {
              Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
              ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                  Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = PrimaryIndigo.copy(alpha = 0.12f),
                    contentColor = PrimaryIndigo
                  ) {
                    Text(
                      text = "#${rule.keyword}",
                      fontWeight = FontWeight.Bold,
                      fontSize = 14.sp,
                      modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                    )
                  }
                  Spacer(modifier = Modifier.width(10.dp))
                  Text(
                    text = "${rule.matchCount} disparos",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                  )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                  Switch(
                    checked = rule.isActive,
                    onCheckedChange = { onToggleRule(rule.id) }
                  )
                  IconButton(onClick = { onDeleteRule(rule.id) }) {
                    Icon(
                      imageVector = Icons.Default.DeleteOutline,
                      contentDescription = null,
                      tint = MaterialTheme.colorScheme.error.copy(alpha = 0.7f),
                      modifier = Modifier.size(20.dp)
                    )
                  }
                }
              }

              Spacer(modifier = Modifier.height(10.dp))
              Text(
                text = "💬 Resposta Pública:",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
              )
              Text(
                text = rule.publicReplyTemplate,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.85f)
              )

              Spacer(modifier = Modifier.height(8.dp))
              Text(
                text = "📩 Mensagem no Direct (DM):",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
              )
              Text(
                text = rule.dmMessage,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.85f)
              )
            }
          }
        }
      }

      2 -> {
        // ASSISTENTE DE RESPOSTAS MANUAIS
        item {
          Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
          ) {
            Column(modifier = Modifier.padding(16.dp)) {
              Text(
                text = "Gerador de Respostas com IA para Qualquer Comentário",
                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
              )
              Text(
                text = "Recebeu uma dúvida difícil, pedido de desconto ou elogio? Deixe a IA gerar respostas perfeitas.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
              )

              Spacer(modifier = Modifier.height(14.dp))

              OutlinedTextField(
                value = manualCommentInput,
                onValueChange = { manualCommentInput = it },
                label = { Text("Cole aqui o comentário do seguidor") },
                placeholder = { Text("Ex: Achei bonito mas achei o preço um pouco caro, tem desconto à vista?") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 2,
                shape = RoundedCornerShape(12.dp)
              )

              Spacer(modifier = Modifier.height(12.dp))

              GradientButton(
                text = "Gerar 3 Variações de Resposta",
                icon = Icons.Default.AutoAwesome,
                onClick = {
                  if (manualCommentInput.isNotBlank()) {
                    isGeneratingVariants = true
                    scope.launch {
                      manualVariants = aiService.generateCommentVariants(businessProfile, manualCommentInput)
                      isGeneratingVariants = false
                    }
                  }
                },
                isLoading = isGeneratingVariants,
                modifier = Modifier.fillMaxWidth()
              )
            }
          }

          if (manualVariants.isNotEmpty()) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
              text = "Escolha o tom ideal e copie com 1 clique:",
              style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
            )
            Spacer(modifier = Modifier.height(8.dp))
          }
        }

        items(manualVariants) { (style, text) ->
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 6.dp),
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
                Surface(
                  shape = CircleShape,
                  color = PrimaryIndigo.copy(alpha = 0.1f),
                  contentColor = PrimaryIndigo
                ) {
                  Text(
                    text = style,
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                  )
                }

                IconButton(
                  onClick = {
                    val cm = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                    cm.setPrimaryClip(ClipData.newPlainText("Resposta", text))
                    Toast.makeText(context, "Resposta copiada!", Toast.LENGTH_SHORT).show()
                  }
                ) {
                  Icon(
                    imageVector = Icons.Default.ContentCopy,
                    contentDescription = null,
                    tint = PrimaryIndigo,
                    modifier = Modifier.size(18.dp)
                  )
                }
              }

              Spacer(modifier = Modifier.height(8.dp))
              Text(
                text = text,
                style = MaterialTheme.typography.bodyMedium,
                lineHeight = 20.sp
              )
            }
          }
        }
      }

      3 -> {
        // LEADS & DMS
        item {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
          ) {
            Text(
              text = "Funil de Leads Captados via Comentários",
              style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
            Surface(
              shape = CircleShape,
              color = PrimaryIndigo.copy(alpha = 0.12f),
              contentColor = PrimaryIndigo
            ) {
              Text(
                text = "${leads.size} Contatos",
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
              )
            }
          }
          Spacer(modifier = Modifier.height(12.dp))
        }

        if (leads.isEmpty()) {
          item {
            Card(
              modifier = Modifier.fillMaxWidth(),
              shape = RoundedCornerShape(14.dp),
              colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
            ) {
              Column(
                modifier = Modifier.padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
              ) {
                Icon(
                  imageVector = Icons.Default.PeopleOutline,
                  contentDescription = null,
                  modifier = Modifier.size(48.dp),
                  tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                  text = "Nenhum lead captado ainda",
                  fontWeight = FontWeight.Bold,
                  fontSize = 15.sp
                )
                Text(
                  text = "Use o Simulador Interativo na primeira aba para testar o envio de DMs!",
                  style = MaterialTheme.typography.bodySmall,
                  color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
              }
            }
          }
        } else {
          items(leads) { lead ->
            Card(
              modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 6.dp),
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
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(PrimaryIndigo.copy(alpha = 0.15f)),
                      contentAlignment = Alignment.Center
                    ) {
                      Icon(Icons.Default.Person, contentDescription = null, tint = PrimaryIndigo, modifier = Modifier.size(18.dp))
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                      Text(
                        text = lead.username,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                      )
                      Text(
                        text = "Comentou: \"${lead.commentText}\"",
                        style = MaterialTheme.typography.labelSmall,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                      )
                    }
                  }

                  Surface(
                    shape = CircleShape,
                    color = SuccessEmerald.copy(alpha = 0.12f),
                    contentColor = SuccessEmeraldDark
                  ) {
                    Text(
                      text = "#${lead.matchedKeyword}",
                      style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                      modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                  }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                  modifier = Modifier.fillMaxWidth(),
                  horizontalArrangement = Arrangement.SpaceBetween,
                  verticalAlignment = Alignment.CenterVertically
                ) {
                  Text(
                    text = "Status: ${lead.status.label}",
                    style = MaterialTheme.typography.labelSmall,
                    color = SuccessEmeraldDark,
                    fontWeight = FontWeight.SemiBold
                  )

                  TextButton(
                    onClick = {
                      val url = "https://wa.me/${businessProfile.ownerPhone}?text=Ol%C3%A1+${lead.username}!+Vi+seu+coment%C3%A1rio+no+post!"
                      try {
                        context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                      } catch (_: Exception) {}
                    }
                  ) {
                    Text("Abrir Conversa", fontSize = 12.sp, color = PrimaryIndigo, fontWeight = FontWeight.Bold)
                    Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(14.dp))
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // DIALOG: ADICIONAR NOVA PALAVRA-CHAVE
  if (showAddRuleDialog) {
    var newKeyword by remember { mutableStateOf("") }
    var newReply by remember { mutableStateOf("Oie! Acabei de te mandar o link exclusivo no seu direct 📩 Confere lá!") }
    var newDm by remember { mutableStateOf("Olá! Segue aqui o catálogo com a promoção exclusiva que você pediu: https://wa.me/${businessProfile.ownerPhone}") }

    AlertDialog(
      onDismissRequest = { showAddRuleDialog = false },
      title = { Text("Cadastrar Palavra-Chave Gatilho", fontWeight = FontWeight.Bold) },
      text = {
        Column(modifier = Modifier.fillMaxWidth()) {
          Text(
            text = "Quando um seguidor comentar esta palavra, a IA responderá o post e enviará a DM com o link imediatamente.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
          )
          Spacer(modifier = Modifier.height(12.dp))

          OutlinedTextField(
            value = newKeyword,
            onValueChange = { newKeyword = it.uppercase() },
            label = { Text("Palavra-Chave (ex: QUERO, PREÇO)") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
          )
          Spacer(modifier = Modifier.height(8.dp))

          OutlinedTextField(
            value = newReply,
            onValueChange = { newReply = it },
            label = { Text("Resposta Pública no Comentário") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 2
          )
          Spacer(modifier = Modifier.height(8.dp))

          OutlinedTextField(
            value = newDm,
            onValueChange = { newDm = it },
            label = { Text("Mensagem Privada de DM + Link") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 2
          )
        }
      },
      confirmButton = {
        Button(
          onClick = {
            if (newKeyword.isNotBlank()) {
              val rule = CommentRule(
                id = UUID.randomUUID().toString(),
                keyword = newKeyword.trim(),
                publicReplyTemplate = newReply,
                dmMessage = newDm,
                isActive = true
              )
              onAddRule(rule)
              showAddRuleDialog = false
              Toast.makeText(context, "Palavra #${newKeyword.trim()} adicionada!", Toast.LENGTH_SHORT).show()
            }
          },
          colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo)
        ) {
          Text("Salvar Gatilho")
        }
      },
      dismissButton = {
        TextButton(onClick = { showAddRuleDialog = false }) {
          Text("Cancelar")
        }
      }
    )
  }
}
