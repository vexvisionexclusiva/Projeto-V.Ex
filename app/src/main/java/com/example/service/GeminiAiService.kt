package com.example.service

import com.example.BuildConfig
import com.example.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID
import java.util.concurrent.TimeUnit

class GeminiAiService {

  private val client = OkHttpClient.Builder()
    .connectTimeout(15, TimeUnit.SECONDS)
    .readTimeout(20, TimeUnit.SECONDS)
    .build()

  private val apiKey: String = try {
    BuildConfig.GEMINI_API_KEY
  } catch (_: Throwable) {
    ""
  }

  private fun hasValidKey(): Boolean {
    return apiKey.isNotBlank() && !apiKey.contains("MY_GEMINI_API_KEY")
  }

  suspend fun generateCommentReply(
    business: BusinessProfile,
    commentText: String,
    matchedKeyword: String?
  ): String = withContext(Dispatchers.IO) {
    if (hasValidKey()) {
      try {
        val prompt = """
          Você é um assistente especialista em social media e vendas para pequenas empresas no Brasil.
          Empresa: ${business.businessName} (Nicho: ${business.niche.displayName})
          Comentário do seguidor no Instagram/TikTok: "$commentText"
          Palavra-chave gatilho detectada: ${matchedKeyword ?: "nenhuma"}
          
          Crie uma resposta pública curta, simpática, profissional e engajadora (máximo 2 frases) incentivando o seguidor e avisando que enviamos o link/detalhes no Direct (DM). Use emojis naturais.
          Retorne APENAS o texto da resposta pública.
        """.trimIndent()
        val result = callGeminiRaw(prompt)
        if (!result.isNullOrBlank()) return@withContext result.trim()
      } catch (_: Exception) {
        // Fallback to local marketing engine
      }
    }
    return@withContext LocalMarketingIntelligence.generateCommentReply(business, commentText, matchedKeyword)
  }

  suspend fun generateCommentVariants(
    business: BusinessProfile,
    commentText: String
  ): List<Pair<String, String>> = withContext(Dispatchers.IO) {
    val variants = mutableListOf<Pair<String, String>>()
    variants.add(
      "Empática & Acolhedora" to "Que alegria ter você por aqui! 🥰 Já te enviamos todos os detalhes especiais no seu direct. Qualquer dúvida, estamos à total disposição!"
    )
    variants.add(
      "Comercial & Focada em Venda" to "Oferta imperdível disponível! 🔥 Acabamos de te mandar o link com desconto exclusivo no seu direct. Garanta antes que acabe o estoque!"
    )
    variants.add(
      "Rápida & Direta ao Ponto" to "Oie! Te mandamos o catálogo e valores no seu Direct agora mesmo 📩 Clica lá para conferir!"
    )
    return@withContext variants
  }

  suspend fun generateExpansionIdeas(
    business: BusinessProfile,
    objective: String
  ): List<ProductExpansionIdea> = withContext(Dispatchers.IO) {
    if (hasValidKey()) {
      try {
        val prompt = """
          Gere 3 ideias inovadoras de expansão de produtos/serviços de alto valor e margem de lucro para a pequena empresa:
          Nome: ${business.businessName}
          Nicho: ${business.niche.displayName}
          Cidade: ${business.city}
          Objetivo do dono: $objective
          
          Responda estritamente em formato JSON com o seguinte array de objetos:
          [
            {
              "title": "Nome do produto/serviço",
              "category": "Ex: Kit Presenteável / Assinatura / Upsell / Linha Premium",
              "description": "Descrição de como funciona e por que vende fácil",
              "estimatedMargin": "Ex: 55% a 70%",
              "suggestedPrice": "Ex: R$ 89,90",
              "targetAudience": "Perfil de cliente ideal",
              "launchStrategy": "Passo a passo rápido para lançar nessa semana"
            }
          ]
        """.trimIndent()
        val jsonText = callGeminiRaw(prompt)
        if (!jsonText.isNullOrBlank()) {
          val cleanJson = cleanJsonString(jsonText)
          val jsonArray = JSONArray(cleanJson)
          val ideas = mutableListOf<ProductExpansionIdea>()
          for (i in 0 until jsonArray.length()) {
            val obj = jsonArray.getJSONObject(i)
            ideas.add(
              ProductExpansionIdea(
                id = UUID.randomUUID().toString(),
                title = obj.optString("title", "Novo Produto"),
                category = obj.optString("category", "Expansão"),
                description = obj.optString("description", ""),
                estimatedMargin = obj.optString("estimatedMargin", "50%"),
                suggestedPrice = obj.optString("suggestedPrice", "R$ 49,90"),
                targetAudience = obj.optString("targetAudience", "Clientes fiéis"),
                launchStrategy = obj.optString("launchStrategy", "Divulgar nos stories com gatilho de DM"),
                isSaved = false
              )
            )
          }
          if (ideas.isNotEmpty()) return@withContext ideas
        }
      } catch (_: Exception) {
        // Fallback to local engine
      }
    }
    return@withContext LocalMarketingIntelligence.generateExpansionIdeas(business, objective)
  }

  suspend fun generateVideoScript(
    business: BusinessProfile,
    product: String,
    format: String,
    keyword: String
  ): VideoScript = withContext(Dispatchers.IO) {
    if (hasValidKey()) {
      try {
        val prompt = """
          Crie um roteiro viral para vídeo curto ($format - Reels/TikTok) para a pequena empresa:
          Empresa: ${business.businessName} (Nicho: ${business.niche.displayName})
          Produto ou Foco: $product
          Palavra-chave gatilho para os comentários: "$keyword"
          
          Responda em formato JSON com a seguinte estrutura:
          {
            "title": "Título atrativo do vídeo",
            "hook": "Frase de impacto para os primeiros 3 segundos para reter atenção",
            "scenes": [
              {
                "sceneNumber": 1,
                "durationSeconds": 3,
                "visualAction": "O que filmar na câmera do celular",
                "spokenText": "O que falar ou locução",
                "onScreenText": "Texto chamativo na tela"
              },
              {
                "sceneNumber": 2,
                "durationSeconds": 8,
                "visualAction": "Apresentação do problema e desejo",
                "spokenText": "Fala de conexão",
                "onScreenText": "Texto 2"
              },
              {
                "sceneNumber": 3,
                "durationSeconds": 10,
                "visualAction": "Demonstração do produto em ação",
                "spokenText": "Apresentação do benefício",
                "onScreenText": "Texto 3"
              },
              {
                "sceneNumber": 4,
                "durationSeconds": 5,
                "visualAction": "Apontando para os comentários",
                "spokenText": "Comenta $keyword que eu te mando o link direto no direct!",
                "onScreenText": "Comente $keyword 👇"
              }
            ],
            "callToAction": "Comente $keyword para receber o link exclusivo no Direct!",
            "audioSuggestion": "Áudio em alta / som acústico animado",
            "caption": "Legenda completa com hashtags recomendadas"
          }
        """.trimIndent()
        val jsonText = callGeminiRaw(prompt)
        if (!jsonText.isNullOrBlank()) {
          val cleanJson = cleanJsonString(jsonText)
          val obj = JSONObject(cleanJson)
          val scenesJson = obj.optJSONArray("scenes")
          val scenesList = mutableListOf<ScriptScene>()
          if (scenesJson != null) {
            for (i in 0 until scenesJson.length()) {
              val s = scenesJson.getJSONObject(i)
              scenesList.add(
                ScriptScene(
                  sceneNumber = s.optInt("sceneNumber", i + 1),
                  durationSeconds = s.optInt("durationSeconds", 5),
                  visualAction = s.optString("visualAction", "Gravando produto"),
                  spokenText = s.optString("spokenText", "Apresentação"),
                  onScreenText = s.optString("onScreenText", "")
                )
              )
            }
          }
          return@withContext VideoScript(
            id = UUID.randomUUID().toString(),
            title = obj.optString("title", "Roteiro Viral de Vendas"),
            format = format,
            hook = obj.optString("hook", "Pare de rolar o feed agora!"),
            scenes = if (scenesList.isNotEmpty()) scenesList else LocalMarketingIntelligence.sampleScenes(keyword),
            callToAction = obj.optString("callToAction", "Comente $keyword no direct!"),
            audioSuggestion = obj.optString("audioSuggestion", "Pop animado em alta no Instagram"),
            caption = obj.optString("caption", "Quer garantir o seu? Comente $keyword aqui nos comentários!")
          )
        }
      } catch (_: Exception) {
        // Fallback
      }
    }
    return@withContext LocalMarketingIntelligence.generateVideoScript(business, product, format, keyword)
  }

  suspend fun generateAdCampaign(
    business: BusinessProfile,
    product: String,
    platform: String
  ): AdCampaign = withContext(Dispatchers.IO) {
    if (hasValidKey()) {
      try {
        val prompt = """
          Crie uma campanha de anúncio de alta conversão para pequenas empresas ($platform):
          Empresa: ${business.businessName} (Nicho: ${business.niche.displayName}, Cidade: ${business.city})
          Produto / Oferta: $product
          
          Responda em formato JSON:
          {
            "title": "Nome da Campanha",
            "headline": "Título magnético do anúncio (máximo 7 palavras)",
            "primaryText": "Texto principal persuasivo aplicando técnica AIDA (Atenção, Interesse, Desejo, Ação)",
            "callToAction": "Ex: Enviar mensagem no WhatsApp / Comente no Post",
            "audienceTargeting": "Sugestão de público-alvo geográfico e interesses locais",
            "sellingPoints": ["Ponto forte 1", "Ponto forte 2", "Ponto forte 3"]
          }
        """.trimIndent()
        val jsonText = callGeminiRaw(prompt)
        if (!jsonText.isNullOrBlank()) {
          val cleanJson = cleanJsonString(jsonText)
          val obj = JSONObject(cleanJson)
          val pointsArray = obj.optJSONArray("sellingPoints")
          val points = mutableListOf<String>()
          if (pointsArray != null) {
            for (i in 0 until pointsArray.length()) points.add(pointsArray.getString(i))
          }
          return@withContext AdCampaign(
            id = UUID.randomUUID().toString(),
            title = obj.optString("title", "Anúncio de Alta Conversão"),
            platform = platform,
            headline = obj.optString("headline", "Transforme seu dia com essa novidade"),
            primaryText = obj.optString("primaryText", "Conheça agora a melhor opção da sua região!"),
            callToAction = obj.optString("callToAction", "Enviar Mensagem no WhatsApp"),
            audienceTargeting = obj.optString("audienceTargeting", "Público raio 10km da sua loja"),
            sellingPoints = if (points.isNotEmpty()) points else listOf("Atendimento rápido", "Qualidade garantida", "Entrega ágil")
          )
        }
      } catch (_: Exception) {
        // Fallback
      }
    }
    return@withContext LocalMarketingIntelligence.generateAdCampaign(business, product, platform)
  }

  suspend fun generateFlyerContent(
    business: BusinessProfile,
    topic: String,
    templateType: FlyerTemplateType
  ): FlyerDesign = withContext(Dispatchers.IO) {
    return@withContext LocalMarketingIntelligence.generateFlyerContent(business, topic, templateType)
  }

  private fun callGeminiRaw(prompt: String): String? {
    val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey"
    val jsonBody = JSONObject().apply {
      put("contents", JSONArray().apply {
        put(JSONObject().apply {
          put("parts", JSONArray().apply {
            put(JSONObject().apply {
              put("text", prompt)
            })
          })
        })
      })
    }

    val request = Request.Builder()
      .url(url)
      .post(jsonBody.toString().toRequestBody("application/json".toMediaType()))
      .build()

    client.newCall(request).execute().use { response ->
      if (!response.isSuccessful) return null
      val respBody = response.body?.string() ?: return null
      val root = JSONObject(respBody)
      val candidates = root.optJSONArray("candidates") ?: return null
      if (candidates.length() == 0) return null
      val firstCandidate = candidates.getJSONObject(0)
      val content = firstCandidate.optJSONObject("content") ?: return null
      val parts = content.optJSONArray("parts") ?: return null
      if (parts.length() == 0) return null
      return parts.getJSONObject(0).optString("text")
    }
  }

  private fun cleanJsonString(raw: String): String {
    var s = raw.trim()
    if (s.startsWith("```json")) {
      s = s.substring(7)
    } else if (s.startsWith("```")) {
      s = s.substring(3)
    }
    if (s.endsWith("```")) {
      s = s.substring(0, s.length - 3)
    }
    return s.trim()
  }
}
