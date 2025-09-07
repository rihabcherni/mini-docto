import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/material.dart';
import 'package:mobile/widgets/alert_util.dart';
import '../services/auth_service.dart';
import 'register_page.dart';
import 'home_page.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final FirebaseAnalytics analytics = FirebaseAnalytics.instance;
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final authService = AuthService();
  bool isLoading = false;


  void handleLogin() async {
    await analytics.logEvent(
      name: "login_attempt",
      parameters: {"email": emailController.text},
    );

    if (emailController.text.isEmpty || passwordController.text.isEmpty) {
      await analytics.logEvent(
        name: "login_failed",
        parameters: {"email": emailController.text, "reason": "champs_vide"},
      );
      AlertUtil.showAlert(context, 'Erreur', 'Veuillez remplir tous les champs', false);
      return;
    }

    setState(() => isLoading = true);

    try {
      final result =
          await authService.login(emailController.text, passwordController.text);
      setState(() => isLoading = false);

      if (result['role'] != 'user') {
        AlertUtil.showAlert(context,'Accès refusé',
          'Seuls les patients peuvent se connecter sur l’application mobile.',false,);
        return;
      }
      await analytics.logLogin(loginMethod: "email");
      AlertUtil.showAlert(context, 'Connexion réussie', 'Bienvenue dans Mini Docto+!', true);
      await Future.delayed(const Duration(seconds: 1));
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => HomePage(token: result['token'])),
      );
    } catch (e) {
      setState(() => isLoading = false);
      await analytics.logEvent(name: "login_failed", parameters: {"reason": e.toString()});
      AlertUtil.showAlert(context, 'Erreur de connexion', 'Email ou mot de passe incorrect', false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Column(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: const Color(0xFF2E86C1).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.medical_services,
                        size: 30, color: Color(0xFF2E86C1)),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Mini Docto+',
                    style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2E86C1)),
                  ),
                  Text('Votre plateforme médicale',
                      style: TextStyle(fontSize: 13, color: Colors.grey[600])),
                ],
              ),

              const SizedBox(height: 20),
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text('Connexion',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF2E86C1))),
                      const SizedBox(height: 16),

                      TextField(
                        controller: emailController,
                        decoration: const InputDecoration(
                          labelText: "Email",
                          prefixIcon: Icon(Icons.email_outlined),
                        ),
                      ),
                      const SizedBox(height: 12),

                      TextField(
                        controller: passwordController,
                        decoration: const InputDecoration(
                          labelText: "Mot de passe",
                          prefixIcon: Icon(Icons.lock_outlined),
                        ),
                        obscureText: true,
                      ),
                      const SizedBox(height: 16),

                      SizedBox(
                        height: 44,
                        child: ElevatedButton(
                          onPressed: isLoading ? null : handleLogin,
                          child: isLoading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                      color: Colors.white, strokeWidth: 2))
                              : const Text("Se connecter"),
                        ),
                      ),

                      const SizedBox(height: 12),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text("Pas de compte ? ",
                              style: TextStyle(color: Colors.grey[600])),
                          TextButton(
                            onPressed: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) => RegisterPage())),
                            child: const Text("Créer un compte",
                                style: TextStyle(fontWeight: FontWeight.w600)),
                          )
                        ],
                      )
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
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
