import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/material.dart';
import 'package:mobile/widgets/alert_util.dart';
import '../services/auth_service.dart';
import 'login_page.dart';

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}
class _RegisterPageState extends State<RegisterPage> {
  final FirebaseAnalytics analytics = FirebaseAnalytics.instance;
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final authService = AuthService();
  bool isLoading = false;
  void handleRegister() async {
    await analytics.logEvent(
      name: "register_attempt",
      parameters: {"email": emailController.text},
    );
    if (nameController.text.isEmpty || emailController.text.isEmpty || passwordController.text.isEmpty) {
        await analytics.logEvent(
          name: "register_failed",
          parameters: {"reason": "champs_vide"},
        );
        AlertUtil.showAlert(context, 'Erreur', 'Veuillez remplir tous les champs', false);
      return;
    }
    if (passwordController.text.length < 6) {
      AlertUtil.showAlert(context, 'Erreur', 'Le mot de passe doit contenir au moins 6 caractères', false);
      return;
    }
    setState(() => isLoading = true);
    try {
      await authService.register(
        nameController.text,
        emailController.text,
        passwordController.text,
      );
      setState(() => isLoading = false);
      await analytics.logSignUp(signUpMethod: "email");
      AlertUtil.showAlert(context, 'Inscription réussie', 'Votre compte a été créé avec succès!', true);
      await Future.delayed(const Duration(seconds: 1));
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => LoginPage()),
      );
    } catch (e) {
      setState(() => isLoading = false);
      await analytics.logEvent(name: "register_failed", parameters: {"reason": e.toString()});
      AlertUtil.showAlert(context, "Erreur d'inscription", "Impossible de créer le compte", false);
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text("Inscription"),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Column(
                children: [
                  Container(width: 60,height: 60,
                    decoration: BoxDecoration(
                      color: const Color(0xFF2E86C1).withOpacity(0.1),borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.person_add,size: 28,color: Color(0xFF2E86C1),),
                  ),
                  const SizedBox(height: 8),
                  const Text('Créer un compte',style: TextStyle(fontSize: 20,fontWeight: FontWeight.bold,color: Color(0xFF2E86C1))),
                  Text('Rejoignez Mini Docto+',style: TextStyle(fontSize: 13, color: Colors.grey[600])),
                ],
              ),
              const SizedBox(height: 20),
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12),),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      TextField( controller: nameController,
                        decoration: const InputDecoration(labelText: "Nom complet",prefixIcon: Icon(Icons.person_outlined),),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: emailController,
                        decoration: const InputDecoration(
                          labelText: "Email",
                          prefixIcon: Icon(Icons.email_outlined),
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: passwordController,
                        decoration: const InputDecoration(
                          labelText: "Mot de passe",
                          prefixIcon: Icon(Icons.lock_outlined),
                          helperText: "Min. 6 caractères",
                        ),
                        obscureText: true,
                      ),
                      const SizedBox(height: 16),
                      SizedBox( height: 44, width: double.infinity,
                        child: ElevatedButton(
                          onPressed: isLoading ? null : handleRegister,
                          child: isLoading
                              ? const SizedBox( width: 18, height: 18,
                                  child: CircularProgressIndicator( color: Colors.white, strokeWidth: 2,),
                                )
                              : const Text("S'inscrire"),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text("Déjà un compte ? ", style: TextStyle(color: Colors.grey[600])),
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text("Se connecter",style: TextStyle(fontWeight: FontWeight.w600),),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
