// pages/home_page.dart
import 'package:flutter/material.dart';
import '../services/professional_service.dart';
import '../models/professional.dart';
import 'professional_detail_page.dart';
import 'my_appointments_page.dart';
import 'profile_page.dart';

class HomePage extends StatefulWidget {
  final String token;
  const HomePage({super.key, required this.token});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<List<Professional>> _professionals;

  @override
  void initState() {
    super.initState();
    _professionals = ProfessionalService().getProfessionals(widget.token);
  }

  Widget _buildDrawer() {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.blue, Colors.lightBlueAccent],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: Colors.white,
                  child: Icon(Icons.person, size: 40, color: Colors.blue),
                ),
                SizedBox(height: 10),
                Text("Bonjour !", style: TextStyle(color: Colors.white, fontSize: 20)),
                Text("Bienvenue sur MiniDocto", style: TextStyle(color: Colors.white70)),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home, color: Colors.blue),
            title: const Text("Accueil"),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.calendar_today, color: Colors.orange),
            title: const Text("Mes rendez-vous"),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (_) => MyAppointmentsPage(token: widget.token)),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.person, color: Colors.green),
            title: const Text("Profil"),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (_) => ProfilePage(token: widget.token)),
              );
            },
          ),
          const Divider(),
        ListTile(
          leading: const Icon(Icons.logout, color: Colors.red),
          title: const Text("Déconnexion", style: TextStyle(color: Colors.red)),
          onTap: () {
            Navigator.pop(context); 
            Navigator.pushReplacementNamed(context, '/login'); 
          },
        ),
        ],
      ),
    );
  }

  Widget _buildProfessionalCard(Professional pro) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
        leading: CircleAvatar(
          backgroundColor: Colors.blue.shade100,
          child: Text(pro.name[0], style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue)),
        ),
        title: Text(pro.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        subtitle: Row(
          children: [
            const Icon(Icons.star, color: Colors.amber, size: 18),
            const SizedBox(width: 4),
            Text("${pro.score}/100", style: const TextStyle(fontWeight: FontWeight.w500)),
          ],
        ),
        trailing: const Icon(Icons.arrow_forward_ios, color: Colors.grey),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ProfessionalDetailPage(
                token: widget.token,
                professionalId: pro.id,
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Professionnels disponibles"),
        backgroundColor: Colors.blue,
      ),
      drawer: _buildDrawer(),
      body: FutureBuilder<List<Professional>>(
        future: _professionals,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final list = snapshot.data!;
            return ListView.builder(
              itemCount: list.length,
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemBuilder: (context, index) => _buildProfessionalCard(list[index]),
            );
          } else if (snapshot.hasError) {
            return Center(child: Text("Erreur: ${snapshot.error}", style: const TextStyle(color: Colors.red)));
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }
}
