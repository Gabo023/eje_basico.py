import 'package:flutter/material.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../services/api_service.dart';
import 'product_form_page.dart';

class ProductListPage extends StatefulWidget {
  const ProductListPage({super.key});

  @override
  State<ProductListPage> createState() => _ProductListPageState();
}

class _ProductListPageState extends State<ProductListPage> {
  final _apiService = ApiService();

  List<Product> _allProducts = [];
  List<Product> _filteredProducts = [];

  List<Category> _categories = [];
  Category? _filterCategory;

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    try {
      final products = await _apiService.getProducts();
      final categories = await _apiService.getCategories();

      setState(() {
        _allProducts = products;
        _filteredProducts = products;
        _categories = categories;
      });

      print('Productos: ${products.length}');
      print('Categorias: ${categories.length}');
    } catch (e) {
      print('Error cargando datos: $e');
    }
  }

  void _applyFilter() {
    if (_filterCategory == null) {
      setState(() {
        _filteredProducts = _allProducts;
      });
    } else {
      setState(() {
        _filteredProducts = _allProducts
            .where((p) => p.categoriaId == _filterCategory!.id)
            .toList();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Productos')),
      body: Column(
        children: [
          // ===== FILTRO POR CATEGORÍA =====
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: DropdownButton<Category?>(
              hint: const Text('Filtrar por categoría'),
              value: _filterCategory,
              isExpanded: true,
              items: [
                const DropdownMenuItem<Category?>(
                  value: null,
                  child: Text('Todas las categorías'),
                ),
                ..._categories.map(
                  (cat) => DropdownMenuItem<Category?>(
                    value: cat,
                    child: Text(cat.nombre),
                  ),
                ),
              ],
              onChanged: (value) {
                setState(() {
                  _filterCategory = value;
                });
                _applyFilter();
              },
            ),
          ),

          const Divider(),

          // ===== LISTA DE PRODUCTOS =====
          Expanded(
            child: ListView.builder(
              itemCount: _filteredProducts.length,
              itemBuilder: (context, index) {
                final p = _filteredProducts[index];
                return ListTile(
                  title: Text(p.nombre),
                  subtitle: Text(
                    'Marca: ${p.marca ?? '-'}\n'
                    'Categoría: ${p.categoriaNombre ?? 'Sin categoría'}',
                  ),
                  trailing: Text('\$${p.precio.toStringAsFixed(2)}'),
                  onTap: () async {
                    final result = await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ProductFormPage(product: p),
                      ),
                    );
                    if (result == true) {
                      _loadInitialData();
                    }
                  },
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const ProductFormPage()),
          );
          if (result == true) {
            _loadInitialData();
          }
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
