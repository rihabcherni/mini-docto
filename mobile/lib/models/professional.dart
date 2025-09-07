import 'package:mobile/models/availability.dart';

class Professional {
  final String id;
  final String name;
  final int score;
  final List<Availability> availabilities; 

  Professional({
    required this.id,
    required this.name,
    required this.score,
    required this.availabilities,
  });

  factory Professional.fromJson(Map<String, dynamic> json) {
    return Professional(
      id: json['_id'] ?? '',  
      name: json['name'] ?? json['user']?['name'] ?? 'Pro',      
      score: json['score'] ?? 0,
      availabilities: (json['availabilities'] as List?)
              ?.map((e) => Availability.fromJson(e))
              .toList() ??
          [],
    );
  }
}
