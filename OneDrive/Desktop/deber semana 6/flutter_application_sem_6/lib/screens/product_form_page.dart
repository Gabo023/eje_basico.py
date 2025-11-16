import 'package:flutter/material.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../services/api_service.dart';

class ProductFormPage extends StatefulWidget {
  final Product? product; // null = crear, no null = editar

  const ProductFormPage({super.key, this.product});

  @override
  State<ProductFormPage> createState() => _ProductFormPageState();
}

class _ProductFormPageState extends State<ProductFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();

  final _nombreController = TextEditingController();
  final _precioController = TextEditingController();
  final _marcaController = TextEditingController();
  final _codigoBarraController = TextEditingController();

  List<Category> _categories = [];
  Category? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _loadCategories();

    if (widget.product != null) {
      _nombreController.text = widget.product!.nombre;
      _precioController.text = widget.product!.precio.toString();
      _marcaController.text = widget.product!.marca ?? '';
      _codigoBarraController.text = widget.product!.codigoBarra ?? '';
    }
  }

  Future<void> _loadCategories() async {
    try {
      final categories = await _apiService.getCategories();
      setState(() {
        _categories = categories;
        if (widget.product != null && widget.product!.categoriaId != null) {
          _selectedCategory = _categories.firstWhere(
            (c) => c.id == widget.product!.categoriaId,
            orElse: () => _categories.first,
          );
        }
      });
    } catch (e) {
      print('Error cargando categorías: $e');
    }
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _precioController.dispose();
    _marcaController.dispose();
    _codigoBarraController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedCategory == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Seleccione una categoría')));
      return;
    }

    final product = Product(
      idProducto: widget.product?.idProducto ?? 0,
      nombre: _nombreController.text,
      precio: double.parse(_precioController.text),
      marca: _marcaController.text.isEmpty ? null : _marcaController.text,
      codigoBarra: _codigoBarraController.text.isEmpty
          ? null
          : _codigoBarraController.text,
      categoriaId: _selectedCategory!.id,
      categoriaNombre: _selectedCategory!.nombre,
    );

    try {
      if (widget.product == null) {
        await _apiService.createProduct(product);
      } else {
        await _apiService.updateProduct(widget.product!.idProducto, product);
      }

      Navigator.pop(context, true); // volvemos a la lista indicando éxito
    } catch (e) {
      print('Error guardando producto: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error al guardar producto')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.product == null ? 'Nuevo producto' : 'Editar producto',
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nombreController,
                decoration: const InputDecoration(labelText: 'Nombre'),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Requerido' : null,
              ),
              TextFormField(
                controller: _precioController,
                decoration: const InputDecoration(labelText: 'Precio'),
                keyboardType: TextInputType.number,
                validator: (value) =>
                    value == null || value.isEmpty ? 'Requerido' : null,
              ),
              TextFormField(
                controller: _marcaController,
                decoration: const InputDecoration(labelText: 'Marca'),
              ),
              TextFormField(
                controller: _codigoBarraController,
                decoration: const InputDecoration(labelText: 'Código de barra'),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<Category>(
                value: _selectedCategory,
                items: _categories
                    .map(
                      (cat) => DropdownMenuItem<Category>(
                        value: cat,
                        child: Text(cat.nombre),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedCategory = value;
                  });
                },
                decoration: const InputDecoration(labelText: 'Categoría'),
                validator: (value) =>
                    value == null ? 'Seleccione una categoría' : null,
              ),
              const SizedBox(height: 24),
              ElevatedButton(onPressed: _save, child: const Text('Guardar')),
            ],
          ),
        ),
      ),
    );
  }
}
