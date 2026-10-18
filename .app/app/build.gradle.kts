import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
}

// Configuración local (no versionada): URL del backend, claves de Maps y Pusher.
// Ver local.properties.example en la raíz del proyecto.
val local = Properties().apply {
    val fichero = rootProject.file("local.properties")
    if (fichero.exists()) fichero.inputStream().use { load(it) }
}

fun propiedad(nombre: String, porDefecto: String = ""): String =
    local.getProperty(nombre) ?: System.getenv(nombre) ?: porDefecto

fun String.comoBuildConfig() = "\"" + replace("\\", "\\\\").replace("\"", "\\\"") + "\""

android {
    namespace = "radioescucha.ledemar.es"
    compileSdk = 37

    defaultConfig {
        applicationId = "radioescucha.ledemar.es"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"

        manifestPlaceholders["MAPS_API_KEY"] = propiedad("MAPS_API_KEY")
        buildConfigField("boolean", "MAPS_CONFIGURADO", propiedad("MAPS_API_KEY").isNotBlank().toString())

        buildConfigField("String", "PUSHER_KEY", propiedad("PUSHER_KEY").comoBuildConfig())
        buildConfigField("String", "PUSHER_CLUSTER", propiedad("PUSHER_CLUSTER", "eu").comoBuildConfig())
        // Solo para Reverb / servidor Pusher propio. Vacío = Pusher cloud.
        buildConfigField("String", "PUSHER_HOST", propiedad("PUSHER_HOST").comoBuildConfig())
        buildConfigField("int", "PUSHER_PORT", propiedad("PUSHER_PORT", "443"))
        buildConfigField("boolean", "PUSHER_TLS", propiedad("PUSHER_TLS", "true"))
    }

    buildTypes {
        debug {
            // 10.0.2.2 es el localhost del PC visto desde el emulador.
            buildConfigField("String", "API_BASE_URL", propiedad("API_BASE_URL_DEBUG", "http://10.0.2.2:8000/").comoBuildConfig())
            applicationIdSuffix = ".debug"
            resValue("string", "app_name", "Radioescucha (debug)")
        }
        release {
            buildConfigField("String", "API_BASE_URL", propiedad("API_BASE_URL", "https://radioescucha.es/").comoBuildConfig())
            resValue("string", "app_name", "Radioescucha")
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        compose = true
        buildConfig = true
        resValues = true
    }

    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.core.splashscreen)
    implementation(libs.androidx.exifinterface)

    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    debugImplementation(libs.androidx.compose.ui.tooling)

    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.datastore.preferences)

    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.serialization.json)

    implementation(libs.retrofit)
    implementation(libs.retrofit.kotlinx.serialization)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)

    implementation(libs.coil.compose)
    implementation(libs.coil.network.okhttp)

    implementation(libs.maps.compose)
    implementation(libs.play.services.location)

    implementation(libs.pusher.java.client)

    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
}
