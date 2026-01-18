* Recordar iniciar la parte de IA que es para sacar resumenes de todos los reviews

Mejoras 18/01/2025

  ---                                                                                                                                                                                       
  ⚠️ Problemas/Inconsistencias detectadas                                                                                                                                                   
                                                                                                                                                                                            
  1. CommentReply no actualiza loadedReplies al eliminar                                                                                                                                    
                                                                                                                                                                                            
  En CommentReply.tsx, cuando se elimina una reply, solo se actualiza el cache de React Query, pero si la reply estaba en loadedReplies (estado local de CommentCard), no se elimina de ahí.
                                                                                                                                                                                            
  2. CommentReply no actualiza likes en loadedReplies                                                                                                                                       
                                                                                                                                                                                            
  Similar al anterior - los likes en replies cargadas manualmente no se actualizan visualmente porque están en estado local, no en el cache.                                                
                                                                                                                                                                                            
  3. El CommentForm fijo puede tapar contenido en móviles                                                                                                                                   
                                                                                                                                                                                            
  El left-64 asume que siempre hay sidebar visible. En móviles podría no funcionar bien.                                                                                                    
                                                                                                                                                                                            
  4. No hay indicador de "autor del review" en replies                                                                                                                                      
                                                                                                                                                                                            
  En CommentCard se muestra badge "Autor" si el comentario es del autor del review, pero en CommentReply no.                                                                                
                                                                                                                                                                                            
  5. Selector de ordenamiento no visible                                                                                                                                                    
                                                                                                                                                                                            
  CommentList acepta sort como prop pero no hay UI para cambiar entre "top", "recent", "oldest".                                                                                            
                                                                                                                                                                                            
  ---                                                                                                                                                                                       
  🚀 Mejoras para próximas actualizaciones                                                                                                                                                  
                                                                                                                                                                                            
  Prioridad Alta                                                                                                                                                                            
  ┌─────────────────────────────┬──────────────────────────────────────────────────────────────────────┬─────────────┐                                                                      
  │           Mejora            │                             Descripción                              │ Complejidad │                                                                      
  ├─────────────────────────────┼──────────────────────────────────────────────────────────────────────┼─────────────┤                                                                      
  │ Selector de ordenamiento    │ Dropdown para ordenar comentarios (Mejores, Recientes, Antiguos)     │ Baja        │                                                                      
  ├─────────────────────────────┼──────────────────────────────────────────────────────────────────────┼─────────────┤                                                                      
  │ Fix estado local de replies │ Pasar loadedReplies y setLoadedReplies a CommentReply o usar context │ Media       │                                                                      
  ├─────────────────────────────┼──────────────────────────────────────────────────────────────────────┼─────────────┤                                                                      
  │ Badge "Autor" en replies    │ Mostrar badge si la reply es del autor del review                    │ Baja        │                                                                      
  ├─────────────────────────────┼──────────────────────────────────────────────────────────────────────┼─────────────┤                                                                      
  │ Responsive del CommentForm  │ Ajustar para móviles sin sidebar                                     │ Baja        │                                                                      
  └─────────────────────────────┴──────────────────────────────────────────────────────────────────────┴─────────────┘                                                                      
  Prioridad Media                                                                                                                                                                           
  ┌──────────────────────┬─────────────────────────────────────────────────────────┬─────────────┐                                                                                          
  │        Mejora        │                       Descripción                       │ Complejidad │                                                                                          
  ├──────────────────────┼─────────────────────────────────────────────────────────┼─────────────┤                                                                                          
  │ Menciones (@usuario) │ Poder mencionar usuarios en comentarios/replies         │ Alta        │                                                                                          
  ├──────────────────────┼─────────────────────────────────────────────────────────┼─────────────┤                                                                                          
  │ Notificaciones       │ Notificar cuando alguien responde a tu comentario       │ Alta        │                                                                                          
  ├──────────────────────┼─────────────────────────────────────────────────────────┼─────────────┤                                                                                          
  │ Editar comentario    │ Permitir editar comentarios propios (con tiempo límite) │ Media       │                                                                                          
  ├──────────────────────┼─────────────────────────────────────────────────────────┼─────────────┤                                                                                          
  │ Reacciones múltiples │ Más opciones que solo like (😂, 😢, 🔥, etc.)           │ Media       │                                                                                          
  └──────────────────────┴─────────────────────────────────────────────────────────┴─────────────┘                                                                                          
  Prioridad Baja (Nice to have)                                                                                                                                                             
  ┌──────────────────────────────┬────────────────────────────────────────────────────┬─────────────┐                                                                                       
  │            Mejora            │                    Descripción                     │ Complejidad │                                                                                       
  ├──────────────────────────────┼────────────────────────────────────────────────────┼─────────────┤                                                                                       
  │ Colapsar/expandir hilos      │ Poder colapsar un comentario con todas sus replies │ Media       │                                                                                       
  ├──────────────────────────────┼────────────────────────────────────────────────────┼─────────────┤                                                                                       
  │ Compartir comentario         │ Link directo a un comentario específico            │ Media       │                                                                                       
  ├──────────────────────────────┼────────────────────────────────────────────────────┼─────────────┤                                                                                       
  │ Reportar comentario          │ Sistema de reportes para moderación                │ Alta        │                                                                                       
  ├──────────────────────────────┼────────────────────────────────────────────────────┼─────────────┤                                                                                       
  │ Comentarios destacados       │ El autor del review puede "fijar" un comentario    │ Media       │                                                                                       
  ├──────────────────────────────┼────────────────────────────────────────────────────┼─────────────┤                                                                                       
  │ GIFs/imágenes en comentarios │ Soporte multimedia                                 │ Alta        │                                                                                       
  └──────────────────────────────┴────────────────────────────────────────────────────┴─────────────┘                                                                                       
  ---                                                                                                                                                                                       
  🔧 Fixes rápidos recomendados ahora                                                                                                                                                       
                                                                                                                                                                                            
  ¿Quieres que implemente alguno de estos fixes inmediatos?                                                                                                                                 
                                                                                                                                                                                            
  1. Selector de ordenamiento - Agregar dropdown en CommentList                                                                                                                             
  2. Badge "Autor" en replies - Pasar reviewAuthorId a CommentReply                                                                                                                         
  3. Fix responsive del CommentForm - Ajustar el left-64     