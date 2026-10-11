package com.example.ui.screens

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.BusinessNiche
import com.example.model.BusinessProfile
import com.example.ui.components.GradientButton
import com.example.ui.components.SectionHeader
import com.example.ui.theme.PrimaryIndigo

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BusinessProfileScreen(
  currentProfile: BusinessProfile,
  onSaveProfile: (BusinessProfile) -> Unit
) {
  val context = LocalContext.current

  var name by remember { mutableStateOf(currentProfile.businessName) }
  var selectedNiche by remember { mutableStateOf(currentProfile.niche) }
  var phone by remember { mutableStateOf(currentProfile.ownerPhone) }
  var instagram by remember { mutableStateOf(currentProfile.ownerInstagram) }
  var catalogUrl by remember { mutableStateOf(currentProfile.catalogUrl) }
  var city by remember { mutableStateOf(currentProfile.city) }

  var expandedNicheDropdown by remember { mutableStateOf(false) }

  LazyColumn(
    modifier = Modifier
      .fillMaxSize()
      .padding(horizontal = 16.dp),
    contentPadding = PaddingValues(bottom = 32.dp)
  ) {
    item {
      Spacer(modifier = Modifier.height(12.dp))
      SectionHeader(
        title = "Perfil da Pequena Empresa",
        subtitle = "Personalize as informações para a IA gerar conteúdos sob medida e links diretos",
        badgeText = "Configurações",
        icon = Icons.Default.Store
      )

      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Text("Identidade do Negócio", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
          Spacer(modifier = Modifier.height(12.dp))

          OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Nome da Empresa") },
            leadingIcon = { Icon(Icons.Default.Business, contentDescription = null) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
          )

          Spacer(modifier = Modifier.height(12.dp))

          // Dropdown Nicho
          Box(modifier = Modifier.fillMaxWidth()) {
            OutlinedTextField(
              value = selectedNiche.displayName,
              onValueChange = {},
              readOnly = true,
              label = { Text("Nicho de Atuação") },
              trailingIcon = {
                IconButton(onClick = { expandedNicheDropdown = true }) {
                  Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                }
              },
              modifier = Modifier.fillMaxWidth(),
              shape = RoundedCornerShape(12.dp)
            )

            DropdownMenu(
              expanded = expandedNicheDropdown,
              onDismissRequest = { expandedNicheDropdown = false }
            ) {
              BusinessNiche.values().forEach { niche ->
                DropdownMenuItem(
                  text = { Text(niche.displayName) },
                  onClick = {
                    selectedNiche = niche
                    expandedNicheDropdown = false
                  }
                )
              }
            }
          }

          Spacer(modifier = Modifier.height(12.dp))

          OutlinedTextField(
            value = city,
            onValueChange = { city = it },
            label = { Text("Cidade / Região") },
            leadingIcon = { Icon(Icons.Default.LocationCity, contentDescription = null) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
          )
        }
      }

      Spacer(modifier = Modifier.height(16.dp))

      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Text("Canais de Conversão Direta (WhatsApp & DM)", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
          Spacer(modifier = Modifier.height(4.dp))
          Text(
            text = "Estes canais serão usados para criar os links automáticos de reencaminho direto para o dono.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
          )
          Spacer(modifier = Modifier.height(12.dp))

          OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("WhatsApp do Dono (DDD + Número sem traços)") },
            placeholder = { Text("Ex: 5511999998888") },
            leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
          )

          Spacer(modifier = Modifier.height(12.dp))

          OutlinedTextField(
            value = instagram,
            onValueChange = { instagram = it.replace("@", "") },
            label = { Text("Instagram da Loja (Sem @)") },
            placeholder = { Text("Ex: minhaloja_oficial") },
            leadingIcon = { Icon(Icons.Default.AlternateEmail, contentDescription = null) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
          )

          Spacer(modifier = Modifier.height(12.dp))

          OutlinedTextField(
            value = catalogUrl,
            onValueChange = { catalogUrl = it },
            label = { Text("Link da Loja Virtual / Catálogo (Opcional)") },
            placeholder = { Text("https://...") },
            leadingIcon = { Icon(Icons.Default.Link, contentDescription = null) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
          )
        }
      }

      Spacer(modifier = Modifier.height(20.dp))

      GradientButton(
        text = "Salvar Dados da Empresa",
        icon = Icons.Default.Save,
        onClick = {
          val updated = BusinessProfile(
            businessName = name.ifBlank { "Minha Empresa" },
            niche = selectedNiche,
            ownerPhone = phone.ifBlank { "5511999998888" },
            ownerInstagram = instagram.ifBlank { "minhaloja" },
            catalogUrl = catalogUrl,
            city = city.ifBlank { "São Paulo, SP" }
          )
          onSaveProfile(updated)
          Toast.makeText(context, "Dados salvos com sucesso!", Toast.LENGTH_SHORT).show()
        },
        modifier = Modifier.fillMaxWidth()
      )
    }
  }
}
