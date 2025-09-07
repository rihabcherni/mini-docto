import 'package:flutter/material.dart';
import '../services/appointment_service.dart';
import '../services/professional_service.dart';
import '../models/appointment.dart';
import '../models/professional.dart';

class MyAppointmentsPage extends StatefulWidget {
  final String token;
  const MyAppointmentsPage({super.key, required this.token});

  @override
  State<MyAppointmentsPage> createState() => _MyAppointmentsPageState();
}

class _MyAppointmentsPageState extends State<MyAppointmentsPage> {
  late Future<List<Appointment>> _appointments;

  @override
  void initState() {
    super.initState();
    _loadAppointments();
  }

  void _loadAppointments() {
    setState(() {
      _appointments = AppointmentService().getAppointments(widget.token);
    });
  }

  String _formatDate(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return 'Date inconnue';
    final dt = DateTime.tryParse(isoDate)?.toLocal();
    if (dt == null) return isoDate;
    return "${dt.day.toString().padLeft(2,'0')}-${dt.month.toString().padLeft(2,'0')}-${dt.year}";
  }

  Color _statusColor(String status) {
    switch (status.toLowerCase()) {
      case "canceled":
        return Colors.red;
      case "booked":
        return Colors.green;
      case "pending":
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  Future<void> _cancelAppointment(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Confirmer l'annulation"),
        content: const Text("Voulez-vous vraiment annuler ce rendez-vous ?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text("Non"),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () => Navigator.pop(context, true),
            child: const Text("Oui"),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      await AppointmentService().cancelAppointment(widget.token, id);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Rendez-vous annulé !"),
          backgroundColor: Colors.green,
        ),
      );
      _loadAppointments();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Erreur: $e"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showUpdateSheet(Appointment app) async {
    try {
      DateTime? newDate = await showDatePicker(
        context: context,
        initialDate: DateTime.tryParse(app.date) ?? DateTime.now(),
        firstDate: DateTime.now(),
        lastDate: DateTime.now().add(const Duration(days: 365)),
      );
      if (newDate == null) return;
      String? newSlot = await showDialog<String>(
        context: context,
        builder: (_) => SimpleDialog(
          title: const Text("Choisir un créneau"),
          children: ["09:00", "10:00", "11:00", "14:00", "15:00"].map((s) {
            return SimpleDialogOption(
              onPressed: () => Navigator.pop(context, s),
              child: Text(s),
            );
          }).toList(),
        ),
      );

      if (newSlot == null) return;

      await _updateAppointment(app.id, newDate.toIso8601String(), newSlot);

    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Erreur lors du choix du créneau: $e"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _updateAppointment(String appointmentId, String newDate, String newSlot) async {
    try {
      await AppointmentService().updateAppointment(widget.token, appointmentId, newDate, newSlot);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Rendez-vous mis à jour !"), backgroundColor: Colors.green),
      );
      _loadAppointments();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erreur: $e"), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Mes rendez-vous"),
        backgroundColor: Colors.blue,
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadAppointments),
        ],
      ),
      body: FutureBuilder<List<Appointment>>(
        future: _appointments,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text("Erreur: ${snapshot.error}"));
          }

          final list = snapshot.data ?? [];
          if (list.isEmpty) {
            return const Center(
              child: Text(
                "Aucun rendez-vous",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
            itemCount: list.length,
            itemBuilder: (context, index) {
              final app = list[index];

              return Card(
                elevation: 3,
                margin: const EdgeInsets.symmetric(vertical: 6),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              app.professionalName,
                              style: const TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                const Icon(Icons.calendar_today,
                                    size: 16, color: Colors.blue),
                                const SizedBox(width: 4),
                                Text(_formatDate(app.date)),
                                const SizedBox(width: 12),
                                const Icon(Icons.access_time,
                                    size: 16, color: Colors.orange),
                                const SizedBox(width: 4),
                                Text(app.slot),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              app.status.toUpperCase(),
                              style: TextStyle(
                                color: _statusColor(app.status),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Row(
                        children: [
                          if (app.status != "canceled")
                            IconButton(
                              icon: const Icon(Icons.cancel,
                                  color: Colors.red, size: 28),
                              onPressed: () => _cancelAppointment(app.id),
                              tooltip: "Annuler",
                            ),
                          if (app.status != "canceled")
                            IconButton(
                              icon:
                                  const Icon(Icons.edit, color: Colors.blue),
                              tooltip: "Modifier",
                              onPressed: () => _showUpdateSheet(app),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
