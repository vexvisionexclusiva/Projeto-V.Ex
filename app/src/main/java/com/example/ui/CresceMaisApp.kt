package com.example.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.*
import com.example.service.GeminiAiService
import com.example.ui.screens.*
import com.example.ui.theme.PrimaryIndigo
import com.example.ui.theme.SuccessEmerald
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CresceMaisApp() {
  val aiService = remember { GeminiAiService() }

  // App State
  var businessProfile by remember {
    mutableStateOf(
      BusinessProfile(
        businessName = "Sabor & Doçura Artesanal",
        niche = BusinessNiche.GASTRONOMIA,
        ownerPhone = "5511988887777",
        ownerInstagram = "sabordocura_oficial",
        catalogUrl = "https://sabordocura.com.br",
        city = "São Paulo, SP"
      )
    )
  }

  var rules by remember {
    mutableStateOf(
      listOf(
        CommentRule(
          id = UUID.randomUUID().toString(),
          keyword = "QUERO",
          publicReplyTemplate = "Oie! 🎉 Que maravilha! Acabei de te enviar a condição especial no seu direct 📩 Confere lá!",
          dmMessage = "Olá! Vi que você comentou QUERO no nosso post! Clica aqui no link para falar direto comigo no WhatsApp e garantir o seu desconto: https://wa.me/5511988887777?text=Quero+o+desconto",
          isActive = true,
          matchCount = 54
        ),
        CommentRule(
          id = UUID.randomUUID().toString(),
          keyword = "PREÇO",
          publicReplyTemplate = "Tabela de valores e opções enviadas no seu Direct agora mesmo! ✨",
          dmMessage = "Oi! Segue o link com todos os valores e tamanhos disponíveis: https://wa.me/5511988887777",
          isActive = true,
          matchCount = 88
        ),
        CommentRule(
          id = UUID.randomUUID().toString(),
          keyword = "CARDAPIO",
          publicReplyTemplate = "Cardápio fresquinho da semana enviado no seu direct! 🛵💨 Dá uma olhada!",
          dmMessage = "Aqui está nosso cardápio completo de hoje! Para pedir com entrega rápida, é só clicar aqui:",
          isActive = true,
          matchCount = 61
        ),
        CommentRule(
          id = UUID.randomUUID().toString(),
          keyword = "PROMO",
          publicReplyTemplate = "Seu cupom especial de 30% OFF acabou de aterrissar no seu Direct! 🎁",
          dmMessage = "Seu cupom exclusivo de 30% OFF está liberado para usar hoje! Clica aqui para resgatar:",
          isActive = true,
          matchCount = 37
        )
      )
    )
  }

  var leads by remember {
    mutableStateOf(
      listOf(
        LeadRecord(
          id = UUID.randomUUID().toString(),
          username = "@mariana_silva",
          commentText = "Eu QUERO saber mais detalhes!",
          matchedKeyword = "QUERO",
          status = LeadStatus.VENDA_CONVERTIDA,
          dmSent = "Link do WhatsApp com cupom enviado"
        ),
        LeadRecord(
          id = UUID.randomUUID().toString(),
          username = "@pedro_alves92",
          commentText = "Qual o PREÇO da caixa de doces?",
          matchedKeyword = "PREÇO",
          status = LeadStatus.INTERAGIU,
          dmSent = "Tabela de valores enviada"
        ),
        LeadRecord(
          id = UUID.randomUUID().toString(),
          username = "@camila_festas",
          commentText = "Tem CARDAPIO para evento de 50 pessoas?",
          matchedKeyword = "CARDAPIO",
          status = LeadStatus.DM_DISPARADA,
          dmSent = "Cardápio corporativo enviado"
        )
      )
    )
  }

  var expansionIdeas by remember {
    mutableStateOf(
      com.example.service.LocalMarketingIntelligence.generateExpansionIdeas(
        businessProfile,
        "Aumentar faturamento e ticket médio"
      )
    )
  }

  // Navigation State
  var currentNavIndex by remember { mutableIntStateOf(0) }

  Scaffold(
    topBar = {
      TopAppBar(
        title = {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(34.dp)
                .clip(CircleShape)
                .background(PrimaryIndigo),
              contentAlignment = Alignment.Center
            ) {
              Icon(
                imageVector = Icons.Default.TrendingUp,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(20.dp)
              )
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
              Text(
                text = "CresceMais PME",
                fontWeight = FontWeight.Black,
                fontSize = 18.sp
              )
              Text(
                text = "${businessProfile.businessName} • ${businessProfile.niche.displayName}",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.65f)
              )
            }
          }
        },
        actions = {
          IconButton(onClick = { currentNavIndex = 5 }) {
            Icon(
              imageVector = Icons.Default.Settings,
              contentDescription = "Configurações da Empresa",
              tint = if (currentNavIndex == 5) PrimaryIndigo else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
          }
        },
        colors = TopAppBarDefaults.topAppBarColors(
          containerColor = MaterialTheme.colorScheme.surface
        )
      )
    },
    bottomBar = {
      NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp
      ) {
        val navItems = listOf(
          Triple("DMs & Social", Icons.Default.ChatBubble, 0),
          Triple("Expansão", Icons.Default.Storefront, 1),
          Triple("Vídeos", Icons.Default.Videocam, 2),
          Triple("Anúncios", Icons.Default.Campaign, 3),
          Triple("Flyers", Icons.Default.Palette, 4)
        )

        navItems.forEach { (title, icon, index) ->
          NavigationBarItem(
            selected = currentNavIndex == index,
            onClick = { currentNavIndex = index },
            icon = { Icon(icon, contentDescription = title) },
            label = { Text(title, fontSize = 11.sp, fontWeight = if (currentNavIndex == index) FontWeight.Bold else FontWeight.Normal) },
            colors = NavigationBarItemDefaults.colors(
              selectedIconColor = PrimaryIndigo,
              indicatorColor = PrimaryIndigo.copy(alpha = 0.15f)
            )
          )
        }
      }
    }
  ) { innerPadding ->
    Box(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding)
        .background(MaterialTheme.colorScheme.background)
    ) {
      val activeKeyword = rules.firstOrNull { it.isActive }?.keyword ?: "QUERO"

      when (currentNavIndex) {
        0 -> SocialAutomationScreen(
          businessProfile = businessProfile,
          rules = rules,
          leads = leads,
          onAddRule = { rules = rules + it },
          onToggleRule = { id ->
            rules = rules.map { if (it.id == id) it.copy(isActive = !it.isActive) else it }
          },
          onDeleteRule = { id ->
            rules = rules.filter { it.id != id }
          },
          onNewLeadGenerated = { newLead ->
            leads = listOf(newLead) + leads
            // Update matched count for the rule
            rules = rules.map {
              if (it.keyword.equals(newLead.matchedKeyword, ignoreCase = true)) {
                it.copy(matchCount = it.matchCount + 1)
              } else it
            }
          },
          aiService = aiService
        )
        1 -> ProductExpansionScreen(
          businessProfile = businessProfile,
          expansionIdeas = expansionIdeas,
          onUpdateIdeas = { expansionIdeas = it },
          aiService = aiService
        )
        2 -> VideoMarketingScreen(
          businessProfile = businessProfile,
          activeKeyword = activeKeyword,
          aiService = aiService
        )
        3 -> AdsGeneratorScreen(
          businessProfile = businessProfile,
          aiService = aiService
        )
        4 -> FlyerStudioScreen(
          businessProfile = businessProfile,
          activeKeyword = activeKeyword,
          aiService = aiService
        )
        5 -> BusinessProfileScreen(
          currentProfile = businessProfile,
          onSaveProfile = {
            businessProfile = it
            currentNavIndex = 0
          }
        )
      }
    }
  }
}
