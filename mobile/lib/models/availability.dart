class Availability {
  final String date;
  final List<String> slots;

  Availability({required this.date, required this.slots});

  factory Availability.fromJson(Map<String, dynamic> json) {
    return Availability(
      date: json['date'] ?? '',
      slots: List<String>.from(json['slots'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': date,
      'slots': slots,
    };
  }
}

