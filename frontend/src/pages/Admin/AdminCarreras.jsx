import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { carreraService } from '../../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const AdminCarreras = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingCarrera, setEditingCarrera] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    universidad: '',
    duracion: '',
    requisitos: '',
    campo_laboral: '',
    link_info: '',
    areas_interes: '',
    habilidades_necesarias: '',
    activo: true,
  })

  const queryClient = useQueryClient()

  const { data: carreras, isLoading } = useQuery({
    queryKey: ['carreras'],
    queryFn: carreraService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: carreraService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['carreras'])
      toast.success('Carrera creada exitosamente')
      setShowModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Error al crear carrera')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => carreraService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['carreras'])
      toast.success('Carrera actualizada exitosamente')
      setShowModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Error al actualizar carrera')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: carreraService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['carreras'])
      toast.success('Carrera eliminada exitosamente')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Error al eliminar carrera')
    },
  })

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      universidad: '',
      duracion: '',
      requisitos: '',
      campo_laboral: '',
      link_info: '',
      areas_interes: '',
      habilidades_necesarias: '',
      activo: true,
    })
    setEditingCarrera(null)
  }

  const handleEdit = (carrera) => {
    setEditingCarrera(carrera)
    setFormData({
      nombre: carrera.nombre || '',
      descripcion: carrera.descripcion || '',
      universidad: carrera.universidad || '',
      duracion: carrera.duracion || '',
      requisitos: carrera.requisitos || '',
      campo_laboral: carrera.campo_laboral || '',
      link_info: carrera.link_info || '',
      areas_interes: carrera.areas_interes || '',
      habilidades_necesarias: carrera.habilidades_necesarias || '',
      activo: carrera.activo !== undefined ? carrera.activo : true,
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCarrera) {
      updateMutation.mutate({ id: editingCarrera.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta carrera?')) {
      deleteMutation.mutate(id)
    }
  }

  const listaCarreras = carreras?.results || carreras || []

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestionar Carreras</h1>
          <p className="mt-2 text-gray-600">
            Administra la información de las carreras universitarias
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          + Nueva Carrera
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {listaCarreras.map((carrera) => (
              <li key={carrera.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {carrera.nombre}
                        </h3>
                        {!carrera.activo && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactiva
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {carrera.universidad} • {carrera.duracion}
                      </p>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                        {carrera.descripcion}
                      </p>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(carrera)}
                        className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(carrera.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingCarrera ? 'Editar Carrera' : 'Nueva Carrera'}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre de la Carrera *
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.nombre}
                        onChange={(e) =>
                          setFormData({ ...formData, nombre: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Universidad *
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.universidad}
                        onChange={(e) =>
                          setFormData({ ...formData, universidad: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Duración *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 5 años"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.duracion}
                        onChange={(e) =>
                          setFormData({ ...formData, duracion: e.target.value })
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Descripción *
                      </label>
                      <textarea
                        required
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.descripcion}
                        onChange={(e) =>
                          setFormData({ ...formData, descripcion: e.target.value })
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Requisitos
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.requisitos}
                        onChange={(e) =>
                          setFormData({ ...formData, requisitos: e.target.value })
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Campo Laboral
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.campo_laboral}
                        onChange={(e) =>
                          setFormData({ ...formData, campo_laboral: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Link de Información
                      </label>
                      <input
                        type="url"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.link_info}
                        onChange={(e) =>
                          setFormData({ ...formData, link_info: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Áreas de Interés
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.areas_interes}
                        onChange={(e) =>
                          setFormData({ ...formData, areas_interes: e.target.value })
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Habilidades Necesarias
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.habilidades_necesarias}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            habilidades_necesarias: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          checked={formData.activo}
                          onChange={(e) =>
                            setFormData({ ...formData, activo: e.target.checked })
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">Activa</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {editingCarrera ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCarreras



