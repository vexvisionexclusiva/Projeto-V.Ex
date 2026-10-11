package com.example.service

import com.example.model.*
import java.util.UUID

object LocalMarketingIntelligence {

  fun generateCommentReply(
    business: BusinessProfile,
    commentText: String,
    matchedKeyword: String?
  ): String {
    val clean = commentText.uppercase()
    val kw = matchedKeyword?.uppercase() ?: ""

    return when {
      kw.isNotBlank() && (clean.contains(kw) || clean.contains("PREÇO") || clean.contains("PRECO") || clean.contains("QUERO")) -> {
        "Oie! 🎉 Que ótimo ter seu interesse! Acabei de te enviar a condição especial e o link direto no seu Direct 📩 Confere lá agora mesmo!"
      }
      clean.contains("ONDE") || clean.contains("ENDEREÇO") || clean.contains("ENDERECO") || clean.contains("LOCAL") -> {
        "Estamos em ${business.city}! 📍 Te mandei a localização exata e horários de atendimento no seu Direct! Qualquer dúvida chama a gente lá!"
      }
      clean.contains("ENTREGA") || clean.contains("FRETE") || clean.contains("ENVIA") -> {
        "Fazemos entrega sim! 🛵📦 Acabamos de te mandar a tabela de frete e prazos no seu Direct para você já garantir o seu!"
      }
      clean.contains("LINDO") || clean.contains("AMEI") || clean.contains("PARABENS") || clean.contains("TOP") -> {
        "Muito obrigado pelo carinho! ❤️ Ficamos muito felizes! Se quiser garantir um mimo com desconto, te mandamos um cupom exclusivo no Direct!"
      }
      else -> {
        "Olá! Agradecemos demais seu comentário ✨ Te mandamos uma mensagem especial no Direct para tirar todas as suas dúvidas!"
      }
    }
  }

  fun generateExpansionIdeas(
    business: BusinessProfile,
    objective: String
  ): List<ProductExpansionIdea> {
    return when (business.niche) {
      BusinessNiche.GASTRONOMIA -> listOf(
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Kit Degustação / Combo Família de Final de Semana",
          category = "Combo de Alto Ticket",
          description = "Agrupamento dos seus 3 itens mais vendidos com 1 sobremesa ou bebida exclusiva, embalados em caixa temática presenteável.",
          estimatedMargin = "65% a 72%",
          suggestedPrice = "R$ 89,90 a R$ 129,90",
          targetAudience = "Casais e famílias que pedem no delivery nas sextas e domingos",
          launchStrategy = "Abrir pré-venda nas quintas-feiras pelos Stories com palavra-chave 'QUEROKIT' disparando direct."
        ),
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Linha de Molhos & Geleias Artesanais em Pote",
          category = "Produto de Prateleira (Take-Away)",
          description = "Engarrafar o molho secreto ou geleia especial da sua cozinha para o cliente levar para casa ou pedir junto no delivery.",
          estimatedMargin = "75%",
          suggestedPrice = "R$ 24,90 (pote 250ml)",
          targetAudience = "Clientes recorrentes que sempre elogiam o tempero da casa",
          launchStrategy = "Oferecer como adicional no checkout do WhatsApp: 'Por + R$ 19,90 leve o molho da casa'."
        ),
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Clube de Assinatura Semanal (Fidelidade VIP)",
          category = "Receita Recorrente",
          description = "O cliente paga uma mensalidade fixa e recebe 1 entrega especial programada toda semana com frete grátis e mimo surpresa.",
          estimatedMargin = "60%",
          suggestedPrice = "R$ 199,00 / mês",
          targetAudience = "Clientes fiéis do bairro que compram mais de 3x por mês",
          launchStrategy = "Divulgar apenas 20 vagas exclusivas de fundadores para gerar escassez imediata."
        )
      )

      BusinessNiche.MODA_VESTUARIO -> listOf(
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Linha de Acessórios & Semijoias Complementares",
          category = "Cross-Selling de Balcão",
          description = "Cintos de couro, lenços, bolsas compactas e brincos que combinam perfeitamente com os looks vendidos.",
          estimatedMargin = "65% a 80%",
          suggestedPrice = "R$ 39,90 a R$ 79,90",
          targetAudience = "Mulheres que buscam o look completo pronto sem ter que pesquisar em outra loja",
          launchStrategy = "Gravar Reels vestindo o vestido com e sem o acessório: 'O detalhe que muda o look todo!'."
        ),
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Cápsula 'Essenciais do Dia a Dia' (Kit 3 Peças)",
          category = "Pacote de Volume",
          description = "Combos de t-shirts premium de algodão ou peças coringas vendidas em conjunto com desconto progressivo.",
          estimatedMargin = "55%",
          suggestedPrice = "R$ 139,90 (3 peças)",
          targetAudience = "Clientes que valorizam praticidade e custo-benefício",
          launchStrategy = "Publicar foto estilo carrossel com 5 formas de combinar as 3 peças."
        ),
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Consultoria de Estilo Express em Vídeo / Provador VIP",
          category = "Serviço de Alto Valor Agregado",
          description = "Atendimento VIP com envio de 'Malinha em Casa' para a cliente experimentar sem compromisso.",
          estimatedMargin = "85% (sem custo extra de estoque)",
          suggestedPrice = "Taxa de R$ 50 (abatida nas compras acima de R$ 200)",
          targetAudience = "Clientes de alto poder aquisitivo que não têm tempo de ir à loja",
          launchStrategy = "Gatilho de DM nos stories: 'Comente MALINHA para receber as peças selecionadas na sua casa'."
        )
      )

      BusinessNiche.BELEZA_ESTETICA -> listOf(
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Kit Home Care Pós-Procedimento",
          category = "Venda de Produtos Físicos",
          description = "Shampoo específico, sérum hidratante ou óleo reparador que potencializa o resultado do tratamento feito no salão.",
          estimatedMargin = "60% a 70%",
          suggestedPrice = "R$ 69,90 a R$ 119,90",
          targetAudience = "Clientes que acabaram de fazer química, coloração, limpeza de pele ou sobrancelhas",
          launchStrategy = "Apresentar logo após finalizar o procedimento com demonstração do aroma e textura."
        ),
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Passaporte da Beleza (Combo Trimestral)",
          category = "Pacote Fidelidade",
          description = "Pacote com 4 manutenções inclusas com desconto garantido e agendamento prioritário nos finais de semana.",
          estimatedMargin = "75%",
          suggestedPrice = "R$ 290,00 a R$ 450,00",
          targetAudience = "Clientes que já fazem manutenção frequente mas esquecem de agendar com antecedência",
          launchStrategy = "Lançar no início do mês com vagas limitadas para garantir agenda cheia na terça e quarta."
        ),
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Dia da Noiva / Madrinha Express",
          category = "Serviço Premium",
          description = "Pacote focado em eventos com maquiagem duradoura, penteado e espumante de cortesia.",
          estimatedMargin = "80%",
          suggestedPrice = "R$ 380,00 por pessoa",
          targetAudience = "Madrinhas, formandas e aniversariantes da cidade",
          launchStrategy = "Postar vídeos de 'Antes e Depois' emocionantes com chamada para orçamento no direct."
        )
      )

      else -> listOf(
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Plano Fidelidade / Assinatura Mensal VIP",
          category = "Receita Recorrente",
          description = "Benefícios exclusivos, atendimento prioritário e descontos fixos para membros cadastrados.",
          estimatedMargin = "70%",
          suggestedPrice = "R$ 49,90 / mês",
          targetAudience = "Clientes que compram com frequência na sua loja",
          launchStrategy = "Criar lista VIP no WhatsApp com ofertas 24h antes do público geral."
        ),
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Combo Compre 2 e Leve o 3º com 50% de Desconto",
          category = "Aumento de Ticket Médio",
          description = "Estimular o cliente a levar um produto complementar de menor giro aumentando o valor total da compra.",
          estimatedMargin = "50%",
          suggestedPrice = "Ticket médio + 40%",
          targetAudience = "Clientes indecisos no checkout",
          launchStrategy = "Flyer digital divulgado no Instagram com palavra-chave 'DESCONTO'."
        ),
        ProductExpansionIdea(
          id = UUID.randomUUID().toString(),
          title = "Cartão Presente Digital (Gift Card)",
          category = "Novos Clientes sem Custo",
          description = "Vales-presente com valores de R$ 50, R$ 100 e R$ 150 para presentear amigos e familiares em datas especiais.",
          estimatedMargin = "100% de entrada antecipada",
          suggestedPrice = "R$ 50 a R$ 150",
          targetAudience = "Pessoas procurando presente de última hora",
          launchStrategy = "Postar nos Stories em datas comemorativas (Aniversários, Dia das Mães, Natal)."
        )
      )
    }
  }

  fun sampleScenes(keyword: String): List<ScriptScene> {
    return listOf(
      ScriptScene(
        sceneNumber = 1,
        durationSeconds = 3,
        visualAction = "Câmera bem próxima mostrando o produto em detalhe ou reação de surpresa no rosto.",
        spokenText = "Se você mora na região e ainda não conhece isso, você está perdendo tempo!",
        onScreenText = "Você PRECISA ver isso! 😱"
      ),
      ScriptScene(
        sceneNumber = 2,
        durationSeconds = 6,
        visualAction = "Mostrando o problema comum que o cliente passa no dia a dia.",
        spokenText = "Todo mundo reclama de falta de tempo e produtos de baixa qualidade...",
        onScreenText = "Cansado de passar por isso?"
      ),
      ScriptScene(
        sceneNumber = 3,
        durationSeconds = 8,
        visualAction = "Demonstração impecável do produto sendo usado, abrindo a embalagem com iluminação boa.",
        spokenText = "É exatamente por isso que preparamos essa edição especial feita sob medida para você!",
        onScreenText = "Qualidade que surpreende ✨"
      ),
      ScriptScene(
        sceneNumber = 4,
        durationSeconds = 5,
        visualAction = "Apontando o dedo para a tela e segurando o produto sorrindo.",
        spokenText = "Comente a palavra '$keyword' aqui embaixo que eu te envio o link exclusivo direto no seu DM!",
        onScreenText = "Comente '$keyword' agora 👇"
      )
    )
  }

  fun generateVideoScript(
    business: BusinessProfile,
    product: String,
    format: String,
    keyword: String
  ): VideoScript {
    return VideoScript(
      id = UUID.randomUUID().toString(),
      title = "Roteiro Viral: 'O Segredo que Ninguém Te Conta' ($product)",
      format = format,
      hook = "Espere! Antes de comprar em qualquer lugar, veja esse detalhe em ${business.businessName}!",
      scenes = sampleScenes(keyword),
      callToAction = "Comente a palavra '$keyword' aqui nos comentários que vou te enviar o link secreto de desconto no seu Direct agora mesmo! 🚀",
      audioSuggestion = "Áudio Instrumental Trend (Pop Moderno com batida envolvente)",
      caption = """
        Você já conhecia essa novidade aqui em ${business.businessName}? ✨
        
        Desenvolvemos tudo com o maior cuidado e carinho para você ter a melhor experiência de ${business.city}!
        
        👇 QUER GARANTIR O SEU COM CONDIÇÃO ESPECIAL?
        Comente "$keyword" aqui embaixo que nosso robô inteligente te envia o link direto no seu Direct em segundos!
        
        #${business.businessName.replace(" ", "").lowercase()} #empreendedorismo #${business.niche.name.lowercase()} #viral #dicas #novidade
      """.trimIndent()
    )
  }

  fun generateAdCampaign(
    business: BusinessProfile,
    product: String,
    platform: String
  ): AdCampaign {
    return AdCampaign(
      id = UUID.randomUUID().toString(),
      title = "Campanha Tração Local: $product",
      platform = platform,
      headline = "Chegou a novidade mais esperada em ${business.city}!",
      primaryText = """
        Você procura qualidade garantida sem pagar preços absurdos? 
        
        Na ${business.businessName}, nós unimos os melhores ingredientes e atendimento nota 10 para transformar seu dia.
        
        ✅ Entrega rápida na sua porta
        ✅ Satisfação 100% garantida
        ✅ Atendimento humanizado direto no WhatsApp
        
        👉 Toque no botão abaixo e fale direto com a gente para garantir sua condição exclusiva antes que o lote termine!
      """.trimIndent(),
      callToAction = "Conversar no WhatsApp",
      audienceTargeting = "Homens e Mulheres (22 a 55 anos) em ${business.city} (Raio de 8km). Interesses: Compras locais, Promoções, Gastronomia e Bem-estar.",
      sellingPoints = listOf(
        "Atendimento imediato direto com o proprietário",
        "Preço justo de produtor local",
        "Envio rápido e embalagem segura"
      )
    )
  }

  fun generateFlyerContent(
    business: BusinessProfile,
    topic: String,
    templateType: FlyerTemplateType
  ): FlyerDesign {
    val (headline, subheadline, badge, keyword) = when (templateType) {
      FlyerTemplateType.PROMO_RELAMPAGO -> Quadruple(
        "SUPER OFERTA RELÂMPAGO",
        "Válido apenas hoje enquanto durarem os estoques!",
        "ATÉ 40% OFF",
        "PROMO"
      )
      FlyerTemplateType.LANCAMENTO_PRODUTO -> Quadruple(
        "NOVIDADE EXCLUSIVA",
        "Conheça o novo lançamento de ${business.businessName}",
        "NOVO",
        "QUERO"
      )
      FlyerTemplateType.COMBO_ESPECIAL -> Quadruple(
        "COMBO DA SEMANA",
        "Mais sabor e economia em um pacote imperdível!",
        "LEVE + PAGUE -",
        "COMBO"
      )
      FlyerTemplateType.CUPOM_DESCONTO -> Quadruple(
        "CUPOM EXCLUSIVO VIP",
        "Pegue seu desconto especial para usar no balcão ou delivery",
        "R$ 20 OFF",
        "CUPOM"
      )
      FlyerTemplateType.EVENTO_INAUGURACAO -> Quadruple(
        "GRANDE INAUGURAÇÃO",
        "Venha celebrar com a gente! Brindes para os primeiros clientes",
        "ESPECIAL",
        "PRESENTE"
      )
    }

    return FlyerDesign(
      id = UUID.randomUUID().toString(),
      headline = headline,
      subheadline = if (topic.isNotBlank()) "$topic - $subheadline" else subheadline,
      badgeText = badge,
      ctaKeyword = "Comente '$keyword' no post para receber o link no Direct!",
      businessName = business.businessName,
      contactInfo = "WhatsApp: ${business.ownerPhone} • @${business.ownerInstagram}",
      colorTheme = FlyerColorTheme.PURPLE_VIBE,
      templateType = templateType
    )
  }

  data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)
}
