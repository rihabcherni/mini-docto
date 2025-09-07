import 'package:flutter/material.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/widgets/alert_util.dart';

class ProfilePage extends StatefulWidget {
  final String token;
  const ProfilePage({Key? key, required this.token}) : super(key: key);

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final AuthService authService = AuthService();

  User? user;
  bool isLoading = true;

  TextEditingController nameController = TextEditingController();
  TextEditingController emailController = TextEditingController();

  @override
  void initState() {
    super.initState();
    loadProfile();
  }

  void loadProfile() async {
    try {
      user = await authService.getProfile(widget.token);
      nameController.text = user!.name;
      emailController.text = user!.email;
      setState(() => isLoading = false);
    } catch (e) {
      AlertUtil.showAlert(
        context,
        "Erreur",
        "Impossible de charger le profil",
        false,
      );
    }
  }

  void saveProfile() async {
    if (_formKey.currentState!.validate()) {
      setState(() => isLoading = true);
      user!.name = nameController.text.trim();
      user!.email = emailController.text.trim();
      try {
        user = await authService.updateProfile(widget.token, user!);

        AlertUtil.showAlert(
          context,
          "Succès",
          "Profil mis à jour avec succès",
          true,
        );
      } catch (e) {
        AlertUtil.showAlert(
          context,
          "Erreur",
          "Échec de la mise à jour",
          false,
        );
      }
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) return const Center(child: CircularProgressIndicator());

    return Scaffold(
      appBar: AppBar(title: const Text('Profil')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              /// Champ Nom
              TextFormField(
                controller: nameController,
                decoration: const InputDecoration(
                  labelText: 'Nom',
                  prefixIcon: Icon(Icons.person),
                  border: OutlineInputBorder(),
                ),
                validator: (value) =>
                    value == null || value.trim().isEmpty
                        ? 'Champ requis'
                        : null,
              ),
              const SizedBox(height: 16),

              /// Champ Email
              TextFormField(
                controller: emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email),
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Champ requis';
                  }
                  // Vérif simple email avec regex
                  final emailRegex =
                      RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                  if (!emailRegex.hasMatch(value.trim())) {
                    return 'Email invalide';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              /// Bouton
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.save),
                  label: const Text('Mettre à jour'),
                  onPressed: saveProfile,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
