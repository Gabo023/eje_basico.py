class Category {
  final int id;
  final String nombre;

  Category({required this.id, required this.nombre});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(id: json['id'] as int, nombre: json['nombre'] as String);
  }
}
