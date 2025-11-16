class Product {
  final int idProducto;
  final String nombre;
  final double precio;
  final String? marca;
  final String? codigoBarra;
  final int? categoriaId;
  final String? categoriaNombre;

  Product({
    required this.idProducto,
    required this.nombre,
    required this.precio,
    this.marca,
    this.codigoBarra,
    this.categoriaId,
    this.categoriaNombre,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      idProducto: json['IdProducto'] as int,
      nombre: json['Nombre'] as String,
      precio: double.parse(json['Precio'].toString()),
      marca: json['Marca'],
      codigoBarra: json['CodigoBarra'],
      categoriaId: json['categoria_id'],
      categoriaNombre: json['Categoria'],
    );
  }

  /// Datos que se envían al backend para crear/editar
  Map<String, dynamic> toJson() {
    return {
      'CodigoBarra': codigoBarra,
      'Nombre': nombre,
      'categoria_id': categoriaId,
      'Marca': marca,
      'Precio': precio,
    };
  }
}
