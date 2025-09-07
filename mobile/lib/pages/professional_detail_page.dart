import 'package:flutter/material.dart';
import '../services/professional_service.dart';
import '../services/appointment_service.dart';
import '../models/professional.dart';

class ProfessionalDetailPage extends StatefulWidget {
  final String professionalId;
  final String token;
  const ProfessionalDetailPage({super.key, required this.professionalId, required this.token});

  @override
  State<ProfessionalDetailPage> createState() => _ProfessionalDetailPageState();
}

class _ProfessionalDetailPageState extends State<ProfessionalDetailPage> {
  Professional? _pro;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchProfessional();
  }

  Future<void> _fetchProfessional() async {
    setState(() => _loading = true);
    try {
      final pro = await ProfessionalService().getProfessionalById(widget.token, widget.professionalId);

      pro.availabilities.sort((a, b) => DateTime.parse(a.date).compareTo(DateTime.parse(b.date)));
      for (var a in pro.availabilities) {
        a.slots.sort((s1, s2) => s1.compareTo(s2));
      }

      setState(() => _pro = pro);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  String _formatDate(String isoDate) {
    final dt = DateTime.tryParse(isoDate)?.toLocal();
    return dt != null
        ? "${dt.day.toString().padLeft(2,'0')}-${dt.month.toString().padLeft(2,'0')}-${dt.year}"
        : isoDate;
  }

  void _showBookingSheet(String date, String slot) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text("Date: ${_formatDate(date)}", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Text("Créneau: $slot", style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                minimumSize: const Size(double.infinity, 48),
              ),
              icon: const Icon(Icons.check_circle),
              onPressed: () async {
                Navigator.pop(context);
                await _bookAppointment(date, slot);
              },
              label: const Text("Réserver"),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _bookAppointment(String date, String slot) async {
    try {
      await AppointmentService().bookAppointment(widget.token, widget.professionalId, date, slot);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Rendez-vous réservé !"),
          backgroundColor: Colors.green,
        ),
      );
      _fetchProfessional();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Erreur: $e"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator());
    if (_error != null) return Center(child: Text(_error!));

    final pro = _pro!;
    return Scaffold(
      appBar: AppBar(title: Text(pro.name), backgroundColor: Colors.blue),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(pro.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.star, color: Colors.amber),
                const SizedBox(width: 4),
                Text("${pro.score}/100", style: const TextStyle(fontSize: 16)),
              ],
            ),
            const SizedBox(height: 24),
            const Text("Disponibilités", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            ...pro.availabilities.map((a) {
              return Card(
                elevation: 3,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                margin: const EdgeInsets.symmetric(vertical: 8),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 16, color: Colors.blue),
                          const SizedBox(width: 6),
                          Text(_formatDate(a.date), style: const TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: a.slots.isNotEmpty
                            ? a.slots.map((slot) => ElevatedButton(
                                  style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
                                  onPressed: () => _showBookingSheet(a.date, slot),
                                  child: Text(slot),
                                )).toList()
                            : [const Text("Aucun créneau")],
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }
}
