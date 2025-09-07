class Appointment {
  final String id;
  final String professionalId;
  final String professionalName;
  final String date;
  final String slot;
  final String status;

  Appointment({
    required this.id,
    required this.professionalId,
    required this.professionalName,
    required this.date,
    required this.slot,
    required this.status,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['_id'] ?? '',
      professionalId: json['professional']?['_id'] ?? '',
      professionalName: json['professional']?['user']?['name'] ?? 'Pro',
      date: json['date'] ?? '',
      slot: json['slot'] ?? '',
      status: json['status'] ?? '',
    );
  }
}
