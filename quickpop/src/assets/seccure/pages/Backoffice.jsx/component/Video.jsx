import { Upload, Video as VideoIcon, PlayCircle, MoreVertical, Clock, Eye, Star, Trash2, Edit2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { getVideos, deleteVideo } from '../../../../config/services/videos.js';

  const VideosPage = ({ openModal, refreshKey, searchTerm: globalSearchTerm }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (typeof globalSearchTerm !== 'undefined') {
        setSearchTerm(globalSearchTerm);
      }
    }, [globalSearchTerm]);

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const fetchVideos = useCallback(async () => {
      try {
        const res = await getVideos();
        // Assuming API returns array of video objects
        // Transform data if necessary to match display requirements
        const videoList = Array.isArray(res) ? res : (res.data || []);
        const formattedVideos = videoList.map(v => ({
          id: v.id,
          title: v.title,
          category: v.category_id ? `Catégorie ${v.category_id}` : (v.category || 'Général'),
          category_id: v.category_id,
          raw_duration: v.duration,
          duration: formatDuration(v.duration), 
          views: v.views || 0,
          likes: 0, 
          status: v.is_public ? 'Publié' : 'Brouillon',
          thumbnail: v.thumbnail_url,
          description: v.description,
          video_url: v.video_url,
          is_featured: v.is_featured,
          is_trending: v.is_trending
        }));
        setVideos(formattedVideos);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchVideos();
    }, [refreshKey, fetchVideos]);

    const handleDelete = async (id) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) {
        try {
          await deleteVideo(id);
          fetchVideos();
        } catch (error) {
          console.error("Error deleting video", error);
        }
      }
    };



    const filteredVideos = videos.filter(video => 
      (video.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des vidéos</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredVideos.length} vidéos disponibles</p>
          </div>
          <div className="flex gap-4">
             {/* Local search removed in favor of global search */}
            <button  
              onClick={() => openModal('bulk-video')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              Ajout en masse
            </button>
            <button 
              onClick={() => openModal('add-video')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              Ajouter une vidéo
            </button>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center items-center py-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
           </div>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredVideos.map(video => (
            <div key={video.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-lg transition">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <VideoIcon className="w-12 h-12 text-white opacity-30" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button onClick={() => openModal('view-video', video)} className="p-3 bg-white rounded-full hover:scale-110 transition">
                    <PlayCircle className="w-6 h-6 text-red-600" />
                  </button>
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    video.status === 'Publié' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {video.status}
                  </span>
                  {video.is_featured && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500 text-white shadow-sm">
                      À la une
                    </span>
                  )}
                  {video.is_trending && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-sm">
                      Tendance
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{video.title}</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openModal('view-video', video)}
                      className="p-1 hover:bg-gray-100 rounded transition flex-shrink-0"
                      title="Voir"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    <button 
                      onClick={() => openModal('edit-video', video)}
                      className="p-1 hover:bg-gray-100 rounded transition flex-shrink-0"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDelete(video.id)}
                      className="p-1 hover:bg-red-50 rounded transition flex-shrink-0 text-red-500"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">{video.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {video.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    );
  };

export default VideosPage;
