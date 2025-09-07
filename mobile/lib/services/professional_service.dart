import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/professional.dart';
import '../config/api_config.dart';

class ProfessionalService {
  Future<List<Professional>> getProfessionals(String token) async {
    final res = await http.get(
      Uri.parse("${ApiConfig.baseUrl}/professionals"),
      headers: {"Authorization": "Bearer $token"},
    );
    if (res.statusCode == 200) {
      final List data = jsonDecode(res.body);
      return data.map((e) => Professional.fromJson(e)).toList()
        ..sort((a, b) => b.score.compareTo(a.score));
    }
    throw Exception("Impossible de charger les professionnels");
  }

  Future<Professional> getProfessionalById(String token, String id) async {
    final response = await http.get(
      Uri.parse("${ApiConfig.baseUrl}/user/$id"),
      headers: {"Authorization": "Bearer $token"},
    );

    if (response.statusCode == 200) {
      return Professional.fromJson(jsonDecode(response.body));
    } else {
      throw Exception("Failed to load professional");
    }
  }
}