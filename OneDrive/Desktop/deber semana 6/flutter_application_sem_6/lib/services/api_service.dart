import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';
import '../models/category.dart';

class ApiService {
  // Windows → localhost
  static const String baseUrl = 'http://localhost:3000';
  // Emulador Android → 10.0.2.2

  Future<List<Product>> getProducts() async {
    final url = Uri.parse('$baseUrl/api/products');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((e) => Product.fromJson(e)).toList();
    } else {
      throw Exception('Error al obtener productos');
    }
  }

  Future<List<Category>> getCategories() async {
    final url = Uri.parse('$baseUrl/api/categories');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      final categories = data.map((e) => Category.fromJson(e)).toList();
      print('Categorías recibidas: ${categories.length}');
      return categories;
    } else {
      print('Error categorías status: ${response.statusCode}');
      throw Exception('Error al obtener categorías');
    }
  }

  Future<Product> createProduct(Product product) async {
    final url = Uri.parse('$baseUrl/api/products');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(product.toJson()),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return Product.fromJson(data);
    } else {
      throw Exception('Error al crear producto: ${response.body}');
    }
  }

  Future<Product> updateProduct(int id, Product product) async {
    final url = Uri.parse('$baseUrl/api/products/$id');
    final response = await http.put(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(product.toJson()),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return Product.fromJson(data);
    } else {
      throw Exception('Error al actualizar producto: ${response.body}');
    }
  }

  Future<void> deleteProduct(int id) async {
    final url = Uri.parse('$baseUrl/api/products/$id');
    final response = await http.delete(url);

    if (response.statusCode != 200) {
      throw Exception('Error al eliminar producto');
    }
  }
}
