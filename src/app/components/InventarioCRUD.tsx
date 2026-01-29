import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";
import QRCode from "react-qr-code";

interface Camisa {
  id: number;
  codigo: string;
  color: string;
  talla: string;
  marca: string;
  precio: number;
  imagen: string;
}

interface InventarioCRUDProps {
  onLogout: () => void;
}

export function InventarioCRUD({ onLogout }: InventarioCRUDProps) {
  // Cargar camisas desde localStorage o usar datos por defecto
  const loadCamisas = (): Camisa[] => {
    const stored = localStorage.getItem('inventario-camisas');
    if (stored) {
      return JSON.parse(stored);
    }
    return [
      { 
        id: 1, 
        codigo: "CAM-001-XL-AZUL", 
        color: "Azul", 
        talla: "XL", 
        marca: "Nike", 
        precio: 45.99,
        imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
      },
      { 
        id: 2, 
        codigo: "CAM-002-M-BLANCA", 
        color: "Blanca", 
        talla: "M", 
        marca: "Adidas", 
        precio: 39.99,
        imagen: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=300&fit=crop"
      },
      { 
        id: 3, 
        codigo: "CAM-003-L-NEGRA", 
        color: "Negra", 
        talla: "L", 
        marca: "Puma", 
        precio: 42.50,
        imagen: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&h=300&fit=crop"
      },
    ];
  };

  const [camisas, setCamisas] = useState<Camisa[]>(loadCamisas());

  // Guardar en localStorage cada vez que cambie camisas
  const updateCamisas = (newCamisas: Camisa[]) => {
    setCamisas(newCamisas);
    localStorage.setItem('inventario-camisas', JSON.stringify(newCamisas));
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Camisa | null>(null);
  const [formData, setFormData] = useState({
    codigo: "",
    color: "",
    talla: "",
    marca: "",
    precio: "",
    imagen: "",
  });
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedCamisa, setSelectedCamisa] = useState<Camisa | null>(null);

  const handleOpenDialog = (camisa?: Camisa) => {
    if (camisa) {
      setEditingProduct(camisa);
      setFormData({
        codigo: camisa.codigo,
        color: camisa.color,
        talla: camisa.talla,
        marca: camisa.marca,
        precio: camisa.precio.toString(),
        imagen: camisa.imagen,
      });
    } else {
      setEditingProduct(null);
      setFormData({ codigo: "", color: "", talla: "", marca: "", precio: "", imagen: "" });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Editar camisa existente
      updateCamisas(camisas.map(c => 
        c.id === editingProduct.id 
          ? {
              ...c,
              codigo: formData.codigo,
              color: formData.color,
              talla: formData.talla,
              marca: formData.marca,
              precio: Number(formData.precio),
              imagen: formData.imagen,
            }
          : c
      ));
    } else {
      // Agregar nueva camisa
      const newCamisa: Camisa = {
        id: Math.max(...camisas.map(c => c.id), 0) + 1,
        codigo: formData.codigo,
        color: formData.color,
        talla: formData.talla,
        marca: formData.marca,
        precio: Number(formData.precio),
        imagen: formData.imagen,
      };
      updateCamisas([...camisas, newCamisa]);
    }
    
    setDialogOpen(false);
    setFormData({ codigo: "", color: "", talla: "", marca: "", precio: "", imagen: "" });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta camisa?")) {
      updateCamisas(camisas.filter(c => c.id !== id));
    }
  };

  const handleViewQR = (camisa: Camisa) => {
    setSelectedCamisa(camisa);
    setQrDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventario de Camisas</h1>
            <p className="text-gray-600">Gestiona tu inventario de camisas</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Camisas en Inventario</CardTitle>
                <CardDescription>Lista completa de camisas con código QR único</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Camisa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? "Editar Camisa" : "Nueva Camisa"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProduct 
                        ? "Modifica los datos de la camisa" 
                        : "Completa los datos de la nueva camisa"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="codigo">Código Único</Label>
                      <Input
                        id="codigo"
                        value={formData.codigo}
                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                        placeholder="Ej: CAM-001-XL-AZUL"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          placeholder="Ej: Azul"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="talla">Talla</Label>
                        <Input
                          id="talla"
                          value={formData.talla}
                          onChange={(e) => setFormData({ ...formData, talla: e.target.value })}
                          placeholder="Ej: XL"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marca">Marca</Label>
                      <Input
                        id="marca"
                        value={formData.marca}
                        onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                        placeholder="Ej: Nike"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="precio">Precio</Label>
                      <Input
                        id="precio"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.precio}
                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                        placeholder="Ej: 45.99"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imagen">URL de Imagen</Label>
                      <Input
                        id="imagen"
                        value={formData.imagen}
                        onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        required
                      />
                      {formData.imagen && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                          <img 
                            src={formData.imagen} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/300x300?text=Imagen+no+disponible";
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <Button type="submit" className="w-full">
                      {editingProduct ? "Guardar Cambios" : "Agregar Camisa"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Talla</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>QR</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {camisas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                        No hay camisas en el inventario
                      </TableCell>
                    </TableRow>
                  ) : (
                    camisas.map((camisa) => (
                      <TableRow key={camisa.id}>
                        <TableCell>
                          <img 
                            src={camisa.imagen} 
                            alt={`${camisa.color} ${camisa.marca}`}
                            className="w-16 h-16 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/300x300?text=No+disponible";
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">{camisa.codigo}</TableCell>
                        <TableCell>{camisa.color}</TableCell>
                        <TableCell>{camisa.talla}</TableCell>
                        <TableCell>{camisa.marca}</TableCell>
                        <TableCell>${camisa.precio.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewQR(camisa)}
                          >
                            Ver QR
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(camisa)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(camisa.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog para mostrar el código QR */}
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Código QR - {selectedCamisa?.codigo}</DialogTitle>
              <DialogDescription>
                Este QR dirige al cliente a la vista pública del producto
              </DialogDescription>
            </DialogHeader>
            {selectedCamisa && (
              <div className="space-y-4">
                <div className="flex justify-center items-center p-4 bg-white rounded-lg border">
                  <QRCode
                    value={`${window.location.origin}/producto/${selectedCamisa.codigo}`}
                    size={256}
                    level="H"
                  />
                </div>
                <div className="space-y-2 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700 mb-1">URL del producto:</p>
                  <p className="text-xs font-mono text-blue-600 break-all">
                    {window.location.origin}/producto/{selectedCamisa.codigo}
                  </p>
                </div>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-center mb-3">
                    <img 
                      src={selectedCamisa.imagen} 
                      alt={`${selectedCamisa.color} ${selectedCamisa.marca}`}
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600">Código:</p>
                    <p className="font-semibold font-mono">{selectedCamisa.codigo}</p>
                    <p className="text-gray-600">Color:</p>
                    <p className="font-semibold">{selectedCamisa.color}</p>
                    <p className="text-gray-600">Talla:</p>
                    <p className="font-semibold">{selectedCamisa.talla}</p>
                    <p className="text-gray-600">Marca:</p>
                    <p className="font-semibold">{selectedCamisa.marca}</p>
                    <p className="text-gray-600">Precio:</p>
                    <p className="font-semibold">${selectedCamisa.precio.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}