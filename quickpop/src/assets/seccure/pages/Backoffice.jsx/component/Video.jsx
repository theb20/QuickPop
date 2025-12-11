import { Upload, Video as VideoIcon, PlayCircle, MoreVertical, Clock, Eye, Star } from 'lucide-react';
import { useState } from 'react';

  const VideosPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const videos = [
      { id: 1, title: 'Hygiène en cuisine : bonnes pratiques', category: 'Hygiène', duration: '08:34', views: 1245, likes: 320, status: 'Publié' },
      { id: 2, title: 'Accueillir le client avec le sourire', category: 'Service', duration: '05:12', views: 980, likes: 210, status: 'Publié' },
      { id: 3, title: 'Utilisation des nouveaux fours', category: 'Technique', duration: '12:45', views: 560, likes: 140, status: 'Brouillon' },
      { id: 4, title: 'Gestion du rush de midi', category: 'Organisation', duration: '09:05', views: 1430, likes: 410, status: 'Publié' },
    ];
    const filteredVideos = videos.filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des vidéos</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredVideos.length} vidéos disponibles</p>
          </div>
          <button 
            onClick={() => {
              console.log('Ajouter une vidéo');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            Ajouter une vidéo
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredVideos.map(video => (
            <div key={video.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-lg transition">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                <VideoIcon className="w-12 h-12 text-white opacity-30" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="p-3 bg-white rounded-full hover:scale-110 transition">
                    <PlayCircle className="w-6 h-6 text-red-600" />
                  </button>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    video.status === 'Publié' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {video.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{video.title}</h3>
                  <button 
                    onClick={() => {
                      console.log('Voir vidéo', video);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition flex-shrink-0"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
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
      </div>
    );
  };

export default VideosPage;
