package com.example.model

enum class BusinessNiche(val displayName: String, val defaultKeyword: String) {
  GASTRONOMIA("Gastronomia & Delivery", "CARDAPIO"),
  MODA_VESTUARIO("Moda & Vestuário", "QUERO"),
  BELEZA_ESTETICA("Beleza, Salão & Estética", "AGENDA"),
  SERVICOS_LOCAIS("Serviços Especializados", "ORCAMENTO"),
  ARTESANATO_DECORACAO("Artesanato & Presentes", "PRECO"),
  VAREJO_COMERCIO("Varejo & Eletrônicos", "PROMO"),
  ACADEMIA_FITNESS("Academia & Treinos", "AULA"),
  PET_SHOP("Pet Shop & Veterinária", "PET"),
  SAUDE_BEMESTAR("Saúde & Bem-Estar", "CONSULTA")
}

enum class DirectLinkType(val label: String, val prefix: String) {
  WHATSAPP("WhatsApp do Dono", "https://wa.me/"),
  INSTAGRAM_DM("Direct do Instagram", "https://ig.me/m/"),
  SITE_CATALOGO("Link do Catálogo / Loja", "https://")
}

data class BusinessProfile(
  val businessName: String = "Sabor & Arte Doceria",
  val niche: BusinessNiche = BusinessNiche.GASTRONOMIA,
  val ownerPhone: String = "5511999998888",
  val ownerInstagram: String = "saborearte_oficial",
  val catalogUrl: String = "https://minhaloja.com.br",
  val city: String = "São Paulo, SP"
)

data class CommentRule(
  val id: String,
  val keyword: String,
  val publicReplyTemplate: String,
  val dmMessage: String,
  val directLinkType: DirectLinkType = DirectLinkType.WHATSAPP,
  val directLinkUrl: String = "",
  val isActive: Boolean = true,
  val matchCount: Int = 0
)

enum class LeadStatus(val label: String) {
  DM_DISPARADA("DM Enviada"),
  INTERAGIU("Abriu Conversa"),
  VENDA_CONVERTIDA("Convertido em Venda")
}

data class LeadRecord(
  val id: String,
  val username: String,
  val platform: String = "Instagram",
  val commentText: String,
  val matchedKeyword: String,
  val status: LeadStatus = LeadStatus.DM_DISPARADA,
  val timestamp: Long = System.currentTimeMillis(),
  val dmSent: String
)

data class ProductExpansionIdea(
  val id: String,
  val title: String,
  val category: String,
  val description: String,
  val estimatedMargin: String,
  val suggestedPrice: String,
  val targetAudience: String,
  val launchStrategy: String,
  val isSaved: Boolean = false
)

data class ScriptScene(
  val sceneNumber: Int,
  val durationSeconds: Int,
  val visualAction: String,
  val spokenText: String,
  val onScreenText: String
)

data class VideoScript(
  val id: String,
  val title: String,
  val format: String, // Reels, TikTok, Shorts
  val hook: String,
  val scenes: List<ScriptScene>,
  val callToAction: String,
  val audioSuggestion: String,
  val caption: String
)

data class AdCampaign(
  val id: String,
  val title: String,
  val platform: String, // Meta Ads, TikTok Ads, Google
  val headline: String,
  val primaryText: String,
  val callToAction: String,
  val audienceTargeting: String,
  val sellingPoints: List<String>
)

enum class FlyerColorTheme(val displayName: String, val bgStart: Long, val bgEnd: Long, val accent: Long) {
  PURPLE_VIBE("Púrpura & Violeta", 0xFF4F46E5, 0xFF7C3AED, 0xFFF59E0B),
  EMERALD_GROWTH("Esmeralda & Menta", 0xFF059669, 0xFF10B981, 0xFFFCD34D),
  SUNSET_CORAL("Pôr do Sol & Coral", 0xFFE11D48, 0xFFF97316, 0xFFFEF08A),
  MIDNIGHT_GOLD("Ouro Negro Elegance", 0xFF0F172A, 0xFF1E293B, 0xFFFBBF24),
  ELECTRIC_BLUE("Azul Elétrico & Ciano", 0xFF1E40AF, 0xFF0284C7, 0xFF38BDF8)
}

enum class FlyerTemplateType(val displayName: String) {
  PROMO_RELAMPAGO("Promoção Relâmpago"),
  LANCAMENTO_PRODUTO("Novo Produto"),
  COMBO_ESPECIAL("Combo / Kit Especial"),
  CUPOM_DESCONTO("Cupom Exclusivo"),
  EVENTO_INAUGURACAO("Inauguração / Evento")
}

data class FlyerDesign(
  val id: String,
  val headline: String,
  val subheadline: String,
  val badgeText: String,
  val ctaKeyword: String,
  val businessName: String,
  val contactInfo: String,
  val colorTheme: FlyerColorTheme = FlyerColorTheme.PURPLE_VIBE,
  val templateType: FlyerTemplateType = FlyerTemplateType.PROMO_RELAMPAGO
)
