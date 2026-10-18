# kotlinx.serialization
-keepattributes *Annotation*, InnerClasses, Signature, Exceptions
-keepclassmembers @kotlinx.serialization.Serializable class ** {
    *** Companion;
    kotlinx.serialization.KSerializer serializer(...);
}
-keep,includedescriptorclasses class radioescucha.ledemar.es.**$$serializer { *; }

# Retrofit (interfaces y métodos suspend)
-keep,allowobfuscation,allowshrinking interface retrofit2.Call
-keep,allowobfuscation,allowshrinking class kotlin.coroutines.Continuation
-keep interface radioescucha.ledemar.es.core.network.ApiService { *; }

# Pusher
-keep class com.pusher.** { *; }
-dontwarn org.slf4j.**
-dontwarn com.google.gson.**
