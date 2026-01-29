import { useParams, Link } from "react-router";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import QRCode from "react-qr-code";
import { ShirtIcon, Tag, Package, DollarSign } from "lucide-react";

interface Producto {
  codigo: string;
  color: string;
  talla: string;
  marca: string;
  precio: number;
  imagen: string;
}

// Función para cargar productos desde localStorage
const loadProductos = (): Record<string, Producto> => {
  const stored = localStorage.getItem('inventario-camisas');
  if (stored) {
    const camisas = JSON.parse(stored);
    const productosMap: Record<string, Producto> = {};
    camisas.forEach((camisa: any) => {
      productosMap[camisa.codigo] = {
        codigo: camisa.codigo,
        color: camisa.color,
        talla: camisa.talla,
        marca: camisa.marca,
        precio: camisa.precio,
        imagen: camisa.imagen
      };
    });
    return productosMap;
  }
  
  // Base de datos por defecto si no hay nada en localStorage
  return {
    "CAM-001-XL-AZUL": {
      codigo: "CAM-001-XL-AZUL",
      color: "Azul",
      talla: "XL",
      marca: "Nike",
      precio: 45.99,
      imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"
    },
    "CAM-002-M-BLANCA": {
      codigo: "CAM-002-M-BLANCA",
      color: "Blanca",
      talla: "M",
      marca: "Adidas",
      precio: 39.99,
      imagen: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=800&fit=crop"
    },
    "CAM-003-L-NEGRA": {
      codigo: "CAM-003-L-NEGRA",
      color: "Negra",
      talla: "L",
      marca: "Puma",
      precio: 42.50,
      imagen: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop"
    }
  };
};

export function ProductView() {
  const { codigo } = useParams<{ codigo: string }>();
  
  if (!codigo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Código de producto no especificado</p>
            <Link to="/">
              <Button className="mt-4">Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const productosDatabase = loadProductos();
  const producto = productosDatabase[codigo];

  if (!producto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
            <p className="text-gray-600 mb-6">
              El código <span className="font-mono bg-gray-100 px-2 py-1 rounded">{codigo}</span> no existe en el inventario.
            </p>
            <Link to="/">
              <Button>Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardContent className="p-0">
          {/* Imagen del producto */}
          <div className="relative h-96 w-full overflow-hidden rounded-t-lg">
            <img 
              src={producto.imagen} 
              alt={`Camisa ${producto.color} ${producto.marca}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800x800?text=Imagen+no+disponible";
              }}
            />
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <p className="text-2xl font-bold text-gray-800">${producto.precio.toFixed(2)}</p>
            </div>
          </div>

          {/* Información del producto */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <ShirtIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Camisa {producto.marca}
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Información básica */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Marca</p>
                    <p className="font-semibold text-gray-800">{producto.marca}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: producto.color.toLowerCase() === 'blanca' ? '#ffffff' : producto.color.toLowerCase() === 'negra' ? '#000000' : producto.color.toLowerCase() === 'azul' ? '#0000ff' : '#gray' }} />
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-semibold text-gray-800">{producto.color}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <ShirtIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Talla</p>
                    <p className="font-semibold text-gray-800">{producto.talla}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Precio</p>
                    <p className="text-xl font-bold text-blue-700">${producto.precio.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Código QR */}
              <div className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-4 text-center">Código QR del producto</p>
                <div className="p-4 bg-white rounded-lg">
                  <QRCode
                    value={`${window.location.origin}/producto/${producto.codigo}`}
                    size={180}
                    level="H"
                  />
                </div>
                <p className="text-xs font-mono text-gray-500 mt-4 text-center break-all">
                  {producto.codigo}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Escanea el código QR para ver esta información en cualquier dispositivo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}