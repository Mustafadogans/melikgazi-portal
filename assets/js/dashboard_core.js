
// --- Script Block Extracted ---

        // Menu Toggle functionality for overlay
        document.getElementById('menu-toggle').addEventListener('change', function() {
    const overlay = document.querySelector('.overlay');
    if(overlay) {
        if(this.checked) {
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }
    }
});

        // --- DYNAMIC RENDERS ---
        function safeRender(fn) {
            try { fn(); } catch (e) { console.error('Error in render:', e); }
        }

        function renderLists() {
            let listeler;
            try { listeler = JSON.parse(localStorage.getItem('portal_listeler')); } catch(e) { listeler = []; }
            const listsContainer = document.querySelector('.list-card');
            
            if (listeler && listeler.length > 0 && listsContainer) {
                const aktifListeler = listeler.filter(l => l.aktif);
                if (aktifListeler.length > 0) {
                    const latest = aktifListeler[0];
                    let htmlListItems = '';
                    if (latest.aciklama) {
                        try {
                            const textLines = latest.aciklama.replace(/<[^>]+>/g, '').split('\n').filter(t => t.trim() !== '');
                            textLines.forEach(line => {
                                htmlListItems += `<li>${line.trim()}</li>`;
                            });
                        } catch(e) {}
                    }
                    if (!htmlListItems) htmlListItems = '<li>Veri bulunamadı.</li>';
                    const tarih = (latest.baslangic) ? latest.baslangic : (latest.kayitTarihi ? latest.kayitTarihi.split(' ')[0] : '-');
                    
                    listsContainer.innerHTML = `
                        <h6 class="font-weight-bold" style="text-transform:uppercase;">${latest.baslik || 'Başlıksız'}</h6>
                        <ul>${htmlListItems}</ul>
                        <div class="date-badge">
                            <i class="fas fa-calendar-day"></i> ${tarih}
                        </div>
                    `;
                }
            }
        }

        function renderNotifications() {
            let bildirimler = [];
            try { 
                const raw = localStorage.getItem('portal_bildirimler');
                if (raw) {
                    bildirimler = JSON.parse(raw); 
                }
            } catch(e) { 
                console.error("Error parsing bildirimler:", e);
            }
            const notifContainer = document.getElementById("notifications-container");
            
            if (notifContainer) {
                if (bildirimler && bildirimler.length > 0) {
                    // Temporarily ignore b.aktif for debugging
                    const aktifBildirimler = bildirimler; 
                    if (aktifBildirimler.length > 0) {
                        let htmlContent = '';
                        aktifBildirimler.forEach(b => {
                            const tarihStr = b.gonderimTarihi || b.kayitTarihi || '-';
                            htmlContent += `
                            <div style="border-left: 4px solid #dc3545; background: #fff; padding: 20px 15px 15px 15px; margin-bottom: 10px; margin-top: 10px;">
                                <div style="display:flex; align-items: flex-start;">
                                    <div style="background: #b0b0b0; color: white; width: 28px; height: 28px; border-radius: 50%; display:flex; justify-content:center; align-items:center; margin-right: 15px; flex-shrink:0; margin-top: 2px;">
                                        <i class="fas fa-bell" style="font-size: 13px;"></i>
                                    </div>
                                    <div style="flex-grow: 1;">
                                        <h6 style="font-weight: 700; color: #444; margin-bottom: 12px; font-size: 15px;">${b.baslik || 'Uyarı'}</h6>
                                        <div style="font-size: 13px; color: #777; line-height: 1.6; margin-bottom: 15px;">
                                            ${b.aciklama || ''}
                                        </div>
                                        <div style="font-size: 13px; color: #888; margin-bottom: 8px;"><i class="far fa-clock" style="color: #ff4d4f; width: 20px;"></i> Tarih/Saat: ${tarihStr}</div>
                                        <div style="display:flex; justify-content: space-between; align-items:center; margin-top: 20px;">
                                            <span style="background: #d9534f; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">${b.ekleyen || 'Admin'}</span>
                                            <span style="font-size: 12px; color: #aaa;">${b.kayitTarihi || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
                        });
                        notifContainer.innerHTML = htmlContent;
                    } else {
                        notifContainer.innerHTML = '<div style="padding:20px; color:#777; font-size:14px; text-align:center;">Hiç aktif bildirim bulunmamaktadır.</div>';
                    }
                } else {
                    notifContainer.innerHTML = '<div style="padding:20px; color:#777; font-size:14px; text-align:center;">Sistemde henüz hiç bildirim yok. (Lütfen admin panelinden ekleyin)</div>';
                }
            }
        }

        function renderAjanda() {
            let ajanda;
            try { ajanda = JSON.parse(localStorage.getItem('portal_ajanda')); } catch(e) { ajanda = []; }
            const dailyEventsContainer = document.getElementById("daily-events-widget");
            
            if (ajanda && ajanda.length > 0 && dailyEventsContainer) {
                const aktifAjanda = ajanda.filter(a => a.aktif);
                if (aktifAjanda.length > 0) {
                    let htmlContent = ``;
                    
                    aktifAjanda.forEach(a => {
                        htmlContent += `
                        <div class="event-item cursor-pointer" onclick="openAgendaModal && openAgendaModal()">
                            <div class="event-time" style="color: #007bff; font-weight:bold;">${a.baslangic || '09:00'}</div>
                            <div class="event-details">
                                <div class="event-title" style="font-weight:600; color:#333;">${a.baslik || 'Etkinlik'}</div>
                                <div class="event-desc" style="font-size:12px; color:#666;">${a.ekleyen || 'Admin'}</div>
                            </div>
                        </div>
                        `;
                    });
                    
                    dailyEventsContainer.innerHTML = htmlContent;
                }
            }
        }
        // --- END DYNAMIC RENDERS ---


        // --- ROLE LOGIC ---
        function applyRoleUI() {
            const role = localStorage.getItem('portal_user_role') || 'personnel';
            const username = localStorage.getItem('portal_username') || 'personel1';
            const nameDisplay = document.getElementById('userDisplayName');
            
            const displayUser = username.charAt(0).toUpperCase() + username.slice(1);
            
            if (role === 'admin') {
                if(nameDisplay) nameDisplay.innerText = displayUser + ' (Yetkili)';
                // Admin sees everything, do nothing.
            } else {
                if(nameDisplay) nameDisplay.innerText = displayUser;
                // Hide admin-only links
                const adminLinks = document.querySelectorAll('.admin-only');
                adminLinks.forEach(link => {
                    link.style.display = 'none';
                });
            }
        }
        
        function handleLogout(e) {
            e.preventDefault();
            localStorage.removeItem('portal_user_role');
            window.location.href = 'index.html';
        }

        document.addEventListener('DOMContentLoaded', function() {
            applyRoleUI();
            safeRender(renderLists);
            safeRender(renderNotifications);
            
        });
        // --- END ROLE LOGIC ---

        // --- AGENDA LOGIC ---
        let calendar;
        let agendaEvents = [];
        let currentWidgetDateStr = null;
        let currentEditEventId = null;
        
        const IMPORTANCE_COLORS = {
            '5': '#dc3545',
            '4': '#fd7e14',
            '3': '#ffc107',
            '2': '#6f42c1',
            '1': '#28a745'
        };
        
        function getStorageKey() {
            const username = localStorage.getItem('portal_username') || 'testuser';
            if (username === 'admin') return 'portal_agenda_events_admin_personal';
            return 'portal_agenda_events_' + username;
        }

        function initWidgetDate() {
            const offset = new Date().getTimezoneOffset();
            const localDate = new Date(new Date().getTime() - (offset*60*1000));
            currentWidgetDateStr = localDate.toISOString().split('T')[0];
        }

        window.changeWidgetDate = function(days) {
            if(!currentWidgetDateStr) initWidgetDate();
            const parts = currentWidgetDateStr.split('-');
            let d = new Date(parts[0], parts[1]-1, parts[2]);
            d.setDate(d.getDate() + days);
            
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            currentWidgetDateStr = `${y}-${m}-${day}`;
            
            renderTodaysEvents();
        };
        
        function loadAgendaEvents() {
            let events = [];
            const currentRole = localStorage.getItem('portal_user_role') || 'personnel';
            const currentUsername = localStorage.getItem('portal_username') || 'testuser';
            
            try {
                let adminSaved = localStorage.getItem('portal_agenda_events_admin');
                if (adminSaved) {
                    let adminEvs = JSON.parse(adminSaved);
                    adminEvs.forEach(ev => {
                        events.push({ ...ev, isAdmin: true });
                    });
                }
            } catch (e) {}
            
            try {
                let userSaved = localStorage.getItem(getStorageKey());
                if (userSaved) {
                    let userEvs = JSON.parse(userSaved);
                    userEvs.forEach(ev => {
                        events.push({ ...ev, isAdmin: false });
                    });
                }
            } catch (e) {}

            // NEW ADMIN PANEL EVENTS (portal_ajanda)
            try {
                const portalAjanda = JSON.parse(localStorage.getItem('portal_ajanda'));
                if (portalAjanda && portalAjanda.length > 0) {
                    const aktifAjanda = portalAjanda.filter(a => a.aktif);
                    aktifAjanda.forEach(a => {
                        events.push({
                            id: a.id,
                            title: a.baslik || 'Etkinlik',
                            date: a.baslangic || new Date().toISOString().split('T')[0],
                            time: '',
                            importance: '3',
                            isPast: false,
                            completed: false,
                            isAdmin: true
                        });
                    });
                }
            } catch(e) {}
            
            agendaEvents = events;
            
            return agendaEvents.map(ev => {
                let color = ev.isAdmin ? '#007bff' : IMPORTANCE_COLORS[ev.importance || '3'];
                return {
                    id: ev.id,
                    title: ev.title,
                    start: ev.date + (ev.time ? 'T' + ev.time : ''),
                    color: color,
                    extendedProps: { time: ev.time, dateStr: ev.date, importance: ev.importance || '3', completed: ev.completed, isAdmin: ev.isAdmin }
                };
            });
        }

        window.initCalendar = function(defaultDate = null) {
            var calendarEl = document.getElementById('calendar');
            if (calendar) {
                calendar.destroy();
            }
            
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                initialDate: defaultDate || new Date(),
                locale: 'tr',
                firstDay: 1,
                headerToolbar: false, 
                height: 'auto',
                fixedWeekCount: false,
                events: function(info, successCallback, failureCallback) {
                    successCallback(loadAgendaEvents());
                },
                dayCellClassNames: function(arg) {
                    const y = arg.date.getFullYear();
                    const m = String(arg.date.getMonth() + 1).padStart(2, '0');
                    const d = String(arg.date.getDate()).padStart(2, '0');
                    const dateStr = `${y}-${m}-${d}`;
                    
                    const dayEvents = agendaEvents.filter(e => e.date === dateStr);
                    if (dayEvents.length === 0) return [];
                    
                    let maxImp = 0;
                    dayEvents.forEach(ev => {
                        if (!ev.isAdmin) {
                            let imp = parseInt(ev.importance || '3');
                            if (imp > maxImp) maxImp = imp;
                        }
                    });
                    
                    if (maxImp > 0) return [`fc-day-importance-${maxImp}`];
                    return [];
                },
                dayCellContent: function(arg) {
                    const y = arg.date.getFullYear();
                    const m = String(arg.date.getMonth() + 1).padStart(2, '0');
                    const d = String(arg.date.getDate()).padStart(2, '0');
                    const dateStr = `${y}-${m}-${d}`;
                    const dayNum = arg.date.getDate();
                    
                    const dayEvents = agendaEvents.filter(e => e.date === dateStr);
                    
                    dayEvents.sort((a, b) => {
                        if (a.isAdmin && !b.isAdmin) return -1;
                        if (!a.isAdmin && b.isAdmin) return 1;
                        return parseInt(b.importance || '3') - parseInt(a.importance || '3');
                    });
                    
                    let dotsHtml = '';
                    if (dayEvents.length > 0) {
                        const displayEvents = dayEvents.slice(0, 8);
                        dotsHtml = '<div style="display:flex; flex-direction:column; flex-wrap: wrap; height: 42px; justify-content:center; gap:3px; margin-left:6px; max-width: 20px;">';
                        displayEvents.forEach(ev => {
                            const color = ev.isAdmin ? '#007bff' : IMPORTANCE_COLORS[ev.importance || '3'];
                            const opacity = ev.completed ? '0.3' : '1';
                            dotsHtml += `<div style="cursor:pointer; width:7px; height:7px; border-radius:50%; background-color:${color}; opacity:${opacity}; box-shadow:0 1px 3px rgba(0,0,0,0.2); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.5)'" onmouseout="this.style.transform='scale(1)'"></div>`;
                        });
                        dotsHtml += '</div>';
                    }
                    
                    let tooltipAttr = "";
                    if (dayEvents.length > 0) {
                        let tooltipText = "<div style='display:flex; flex-direction:column; padding: 4px 0; min-width: 180px;'>";
                        tooltipText += dayEvents.map((e, index) => {
                            const isLast = index === dayEvents.length - 1;
                            const borderStyle = isLast ? '' : "border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 12px; margin-bottom: 12px; box-shadow: 0 4px 4px -4px rgba(0,0,0,0.05);";
                            
                            const color = e.isAdmin ? '#007bff' : IMPORTANCE_COLORS[e.importance || '3'];
                            const opacity = e.completed ? '0.5' : '1';
                            const textDeco = e.completed ? 'line-through' : 'none';
                            const timeBadge = e.time ? `<div style='font-size:11px; color:#4a5568; font-weight:700; background:#edf2f7; border:1px solid #e2e8f0; padding:4px 8px; border-radius:6px; margin-left:24px; white-space:nowrap; display:flex; align-items:center; gap:4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); opacity:${opacity};'><i class='far fa-clock'></i> ${e.time}</div>` : '';
                            
                            return `<div style='display:flex; align-items:center; justify-content:space-between; width: 100%; ${borderStyle}'>
                                <div style='display:flex; align-items:center; opacity:${opacity};'>
                                    <div style='width:12px; height:12px; border-radius:50%; background-color:${color}; margin-right:12px; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.2);'></div>
                                    <div style='font-size:14px; color:#1a202c; font-weight:600; line-height:1.3; letter-spacing: -0.2px; text-decoration: ${textDeco};'>${e.title}</div>
                                </div>
                                ${timeBadge}
                            </div>`;
                        }).join('');
                        tooltipText += "</div>";
                        let escapedTooltipText = tooltipText.replace(/"/g, '&quot;');
                        tooltipAttr = `data-toggle="tooltip" data-html="true" data-placement="right" title="${escapedTooltipText}"`;
                    }
                    
                    let html = `
                        <div class="custom-day-cell" ${tooltipAttr} style="cursor:pointer; display:flex; flex-direction:row; justify-content:center; align-items:center; width:100%; height:100%;">
                            <div class="date-month" style="font-weight:bold; font-size:15px; color:#333;">${dayNum}</div>
                            ${dotsHtml}
                        </div>
                    `;
                    return { html: html };
                },
                datesSet: function(info) {
                    document.getElementById('agenda-month-year').textContent = info.view.title;
                },
                dateClick: function(info) {
                    currentEditEventId = null;
                    currentWidgetDateStr = info.dateStr;
                    renderTodaysEvents();
                    
                    const dateObj = new Date(info.dateStr);
                    const displayDate = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                    document.getElementById('agendaModalTitle').innerHTML = `<i class="far fa-calendar-alt text-primary"></i> ${displayDate} Planları`;
                    
                    document.getElementById('agendaDate').value = info.dateStr;
                    document.getElementById('agendaTitle').value = '';
                    document.getElementById('agendaTime').value = '';
                    document.getElementById('agendaImportance').value = '3';
                    $('#agendaFormCollapse').collapse('hide');
                    
                    
                    
                    renderEventList(info.dateStr);
                    $('#agendaModal').modal('show');
                }
            });
            calendar.render();
            
            // Destroy any existing tooltips before re-initializing to prevent ghost tooltips
                        $('[data-toggle="tooltip"]').tooltip('dispose');
            
            if (!document.getElementById('premium-tooltip-override')) {
                const style = document.createElement('style');
                style.id = 'premium-tooltip-override';
                style.innerHTML = `
                    .tooltip.show { opacity: 1 !important; }
                    .tooltip .arrow { display: none !important; }
                `;
                document.head.appendChild(style);
            }

            
            // Initialize aesthetic tooltips
            $('body').tooltip({
                selector: '[data-toggle="tooltip"]',
                boundary: 'window',
                html: true,
                sanitize: false,
                animation: false,
                delay: { "show": 0, "hide": 0 },
                template: '<div class="tooltip custom-light-tooltip" role="tooltip" style="margin-left: 5px;"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
            });
            
            setTimeout(renderTodaysEvents, 100);
        };

        document.addEventListener('DOMContentLoaded', function() {
            initCalendar();
        });

        window.saveAgendaEvent = function() {
            const dateStr = document.getElementById('agendaDate').value;
            const title = document.getElementById('agendaTitle').value;
            const time = document.getElementById('agendaTime').value;
            const importance = document.getElementById('agendaImportance').value || '3';
            
            if(!title) { alert('Lütfen bir başlık girin.'); return; }
            
            const currentUsername = localStorage.getItem('portal_username') || 'testuser';
            
            let isEventAdmin = false;
            
            if (currentEditEventId) {
                const evIndex = agendaEvents.findIndex(e => e.id === currentEditEventId);
                if (evIndex !== -1) {
                    agendaEvents[evIndex].date = dateStr;
                    agendaEvents[evIndex].title = title;
                    agendaEvents[evIndex].time = time;
                    agendaEvents[evIndex].importance = importance;
                    agendaEvents[evIndex].isAdmin = isEventAdmin; // Update type if admin changed it
                }
                currentEditEventId = null;
            } else {
                const newEvent = {
                    id: 'evt_' + Date.now(),
                    date: dateStr,
                    title: title,
                    time: time,
                    importance: importance,
                    completed: false,
                    isAdmin: isEventAdmin
                };
                agendaEvents.push(newEvent);
            }
            
            const toSaveAdmin = agendaEvents.filter(e => e.isAdmin);
            const toSaveUser = agendaEvents.filter(e => !e.isAdmin);
            
            localStorage.setItem('portal_agenda_events_admin', JSON.stringify(toSaveAdmin));
            localStorage.setItem(getStorageKey(), JSON.stringify(toSaveUser));
            
            document.getElementById('agendaTitle').value = '';
            document.getElementById('agendaTime').value = '';
            document.getElementById('agendaImportance').value = '3';
            
            $('#agendaFormCollapse').collapse('hide');
            
            renderEventList(dateStr);
            renderTodaysEvents();
            
            let currentViewDate = calendar.getDate();
            initCalendar(currentViewDate);
        };

        window.editAgendaEvent = function(id) {
            const ev = agendaEvents.find(e => e.id === id);
            if(ev) {
                currentEditEventId = ev.id;
                document.getElementById('agendaDate').value = ev.date;
                document.getElementById('agendaTitle').value = ev.title;
                document.getElementById('agendaTime').value = ev.time || '';
                document.getElementById('agendaImportance').value = ev.importance || '3';
                
                const currentUsername = localStorage.getItem('portal_username') || 'testuser';
                const typeContainer = document.querySelector('.admin-event-type-container');
                if (typeContainer) {
                    typeContainer.style.display = (currentUsername === 'admin') ? 'block' : 'none';
                }
                const typeSelect = document.getElementById('agendaEventType');
                if(typeSelect && currentUsername === 'admin') {
                    typeSelect.value = ev.isAdmin ? 'admin' : 'personal';
                }
                
                // Show modal if it was closed
                $('#agendaModal').modal('show');
                // Open collapse form
                $('#agendaFormCollapse').collapse('show');
            }
        };

        window.renderEventList = function(dateStr) {
            const listEl = document.getElementById('modalEventList');
            if(!listEl) return;
            
            const dayEvents = agendaEvents.filter(e => e.date === dateStr);
            dayEvents.sort((a, b) => {
                if (a.isAdmin && !b.isAdmin) return -1;
                if (!a.isAdmin && b.isAdmin) return 1;
                return parseInt(b.importance || '3') - parseInt(a.importance || '3');
            });
            
            const currentRole = localStorage.getItem('portal_user_role') || 'personnel';
            
            let html = '';
            if (dayEvents.length === 0) {
                html = '<div class="text-center text-muted py-3" style="font-size:12px;"><i class="far fa-folder-open mb-2" style="font-size:20px;"></i><br>Bu tarihe ait plan bulunamadı.</div>';
            } else {
                dayEvents.forEach(ev => {
                    const timeStr = ev.time ? `Saat: ${ev.time}` : 'Tüm Gün';
                    const isChecked = ev.completed ? 'checked' : '';
                    const color = ev.isAdmin ? '#007bff' : IMPORTANCE_COLORS[ev.importance || '3'];
                    const titleStyle = ev.completed ? `text-decoration: line-through; opacity: 0.5; color: ${color};` : `color: ${color};`;
                    const containerOpacity = ev.completed ? 'opacity: 0.7;' : '';
                    const stars = '⭐'.repeat(parseInt(ev.importance || '3'));
                    
                    const canEdit = (!ev.isAdmin);
                    const checkboxHtml = canEdit ? `<input type="checkbox" style="width: 18px; height: 18px; margin-right: 12px; cursor: pointer;" ${isChecked} onchange="toggleEventCompletion('${ev.id}', '${dateStr}')">` : 
                                                   `<div style="width: 18px; height: 18px; margin-right: 12px;"></div>`;
                    const editHtml = canEdit ? `<i class="fas fa-edit text-primary mr-2" style="cursor:pointer; font-size:12px; padding:3px;" onclick="editAgendaEvent('${ev.id}')"></i>` : '';
                    const trashHtml = canEdit ? `<i class="fas fa-trash text-danger" style="cursor:pointer; font-size:12px; padding:3px;" onclick="deleteAgendaEvent('${ev.id}', '${dateStr}')"></i>` : '';
                    
                    html += `
                        <div class="event-item mb-2" style="background:#fff; border:1px solid #eee; border-left:3px solid ${color}; padding:10px; border-radius:6px; ${containerOpacity}">
                            <div class="d-flex align-items-center">
                                ${checkboxHtml}
                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <strong style="font-size:13px; ${titleStyle}">${stars} ${ev.title}</strong>
                                        <div>${editHtml}${trashHtml}</div>
                                    </div>
                                    <div class="mt-1" style="${ev.completed ? 'opacity:0.5;' : ''}">
                                        <span class="text-muted" style="font-size:12px;"><i class="far fa-clock"></i> ${timeStr} ${ev.isAdmin ? '(Yetkili Etkinliği)' : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                });
            }
            listEl.innerHTML = html;
        };

        window.toggleEventCompletion = function(id, dateStr) {
            const eventIndex = agendaEvents.findIndex(e => e.id === id);
            if(eventIndex !== -1) {
                const ev = agendaEvents[eventIndex];
                ev.completed = !ev.completed;
                
                const currentUsername = localStorage.getItem('portal_username') || 'testuser';
                const saveKey = ev.isAdmin ? 'portal_agenda_events_admin' : getStorageKey();
                const toSave = agendaEvents.filter(e => e.isAdmin === ev.isAdmin);
                localStorage.setItem(saveKey, JSON.stringify(toSave));
                
                renderEventList(dateStr);
                renderTodaysEvents();
                let currentViewDate = calendar.getDate();
                initCalendar(currentViewDate);
            }
        };

        window.deleteAgendaEvent = function(id, dateStr) {
            if(confirm("Bu planı silmek istiyor musunuz?")) {
                const ev = agendaEvents.find(e => e.id === id);
                agendaEvents = agendaEvents.filter(e => e.id !== id);
                
                const saveKey = ev.isAdmin ? 'portal_agenda_events_admin' : getStorageKey();
                const toSave = agendaEvents.filter(e => e.isAdmin === ev.isAdmin);
                localStorage.setItem(saveKey, JSON.stringify(toSave));
                
                renderEventList(dateStr);
                renderTodaysEvents();
                let currentViewDate = calendar.getDate();
                initCalendar(currentViewDate);
            }
        };

        window.toggleAgendaExtraEvents = function() {
            window.agendaWidgetExpanded = !window.agendaWidgetExpanded;
            renderTodaysEvents();
        };

        window.setAgendaSortMode = function(mode) {
            localStorage.setItem('portal_agenda_sort_mode', mode);
            renderTodaysEvents();
        };

        window.agendaDragStart = function(e, id) {
            e.dataTransfer.setData('text/plain', id);
            e.dataTransfer.effectAllowed = 'move';
        };
        
        window.agendaDragOver = function(e) {
            e.preventDefault();
            e.currentTarget.style.borderTop = '2px solid #007bff';
        };

        window.agendaDragLeave = function(e) {
            e.currentTarget.style.borderTop = '1px solid #f1f1f1';
        };
        
        window.agendaDrop = function(e, targetId) {
            e.preventDefault();
            e.currentTarget.style.borderTop = '1px solid #f1f1f1';
            const draggedId = e.dataTransfer.getData('text/plain');
            if (!draggedId || draggedId === targetId) return;
            
            const targetDateStr = currentWidgetDateStr;
            let dayEvents = agendaEvents.filter(ev => ev.date === targetDateStr);
            
            let sortMode = localStorage.getItem('portal_agenda_sort_mode') || 'time';
            dayEvents.sort((a,b) => {
                if (sortMode === 'time') {
                    if (a.time && !b.time) return -1;
                    if (!a.time && b.time) return 1;
                    if (a.time && b.time) return a.time.localeCompare(b.time);
                    return parseInt(b.importance || '3') - parseInt(a.importance || '3');
                } else if (sortMode === 'importance') {
                    if (a.isAdmin && !b.isAdmin) return -1;
                    if (!a.isAdmin && b.isAdmin) return 1;
                    return parseInt(b.importance || '3') - parseInt(a.importance || '3');
                } else if (sortMode === 'manual') {
                    return (a.customOrder || 0) - (b.customOrder || 0);
                }
                return 0;
            });
            
            const draggedIdx = dayEvents.findIndex(ev => ev.id === draggedId);
            const targetIdx = dayEvents.findIndex(ev => ev.id === targetId);
            
            if (draggedIdx > -1 && targetIdx > -1) {
                const [draggedItem] = dayEvents.splice(draggedIdx, 1);
                dayEvents.splice(targetIdx, 0, draggedItem);
                
                dayEvents.forEach((ev, index) => {
                    ev.customOrder = index;
                });
                
                const toSaveAdmin = agendaEvents.filter(ev => ev.isAdmin);
                const toSaveUser = agendaEvents.filter(ev => !ev.isAdmin);
                localStorage.setItem('portal_agenda_events_admin', JSON.stringify(toSaveAdmin));
                localStorage.setItem(getStorageKey(), JSON.stringify(toSaveUser));
                
                localStorage.setItem('portal_agenda_sort_mode', 'manual');
                renderTodaysEvents();
            }
        };

        window.renderTodaysEvents = function() {
            const widgetEl = document.getElementById('daily-events-widget');
            if(!widgetEl) return;
            
            if(!currentWidgetDateStr) initWidgetDate();
            const targetDateStr = currentWidgetDateStr;
            
            const parts = targetDateStr.split('-');
            const dateObj = new Date(parts[0], parts[1]-1, parts[2]);
            const titleDate = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
            
            const offset = new Date().getTimezoneOffset();
            const localToday = new Date(new Date().getTime() - (offset*60*1000));
            const todayStr = localToday.toISOString().split('T')[0];
            
            let titleText = `${titleDate} Etkinlikleri`;
            if (targetDateStr === todayStr) {
                titleText = `BUGÜNÜN ETKİNLİKLERİ (${titleDate})`;
            }
            const titleEl = document.getElementById('daily-events-title');
            if(titleEl) titleEl.innerText = titleText.toUpperCase();
            
            let sortMode = localStorage.getItem('portal_agenda_sort_mode') || 'time';
            const sortBtn = document.getElementById('agendaSortDropdown');
            if (sortBtn) {
                if (sortMode === 'time') sortBtn.innerText = 'Saate Göre';
                else if (sortMode === 'importance') sortBtn.innerText = 'Öneme Göre';
                else if (sortMode === 'manual') sortBtn.innerText = 'Özel Sıra';
            }
            
            const todayEvents = agendaEvents.filter(e => e.date === targetDateStr);
            todayEvents.sort((a,b) => {
                if (sortMode === 'time') {
                    if (a.time && !b.time) return -1;
                    if (!a.time && b.time) return 1;
                    if (a.time && b.time) return a.time.localeCompare(b.time);
                    return parseInt(b.importance || '3') - parseInt(a.importance || '3');
                } else if (sortMode === 'importance') {
                    if (a.isAdmin && !b.isAdmin) return -1;
                    if (!a.isAdmin && b.isAdmin) return 1;
                    return parseInt(b.importance || '3') - parseInt(a.importance || '3');
                } else if (sortMode === 'manual') {
                    return (a.customOrder || 0) - (b.customOrder || 0);
                }
                return 0;
            });
            
            if (todayEvents.length > 0) {
                let eventsHtml = '';
                if (typeof window.agendaWidgetExpanded === 'undefined') {
                    window.agendaWidgetExpanded = false;
                }
                
                todayEvents.forEach((ev, index) => {
                    const timeStr = ev.time ? `${ev.time}` : 'Tüm Gün';
                    const color = ev.isAdmin ? '#007bff' : IMPORTANCE_COLORS[ev.importance || '3'];
                    const opacity = ev.completed ? '0.4' : '1';
                    const textDeco = ev.completed ? 'line-through' : 'none';
                    
                    let mb = '2';
                    if (index === todayEvents.length - 1) mb = '0';
                    else if (index === 3 && !window.agendaWidgetExpanded && todayEvents.length > 4) mb = '0';
                    
                    if (index === 4) {
                        const displayStyle = window.agendaWidgetExpanded ? 'block' : 'none';
                        eventsHtml += `<div id="agenda-extra-events" style="display: ${displayStyle};">`;
                    }
                    
                    eventsHtml += `
                        <div draggable="true" ondragstart="agendaDragStart(event, '${ev.id}')" ondragover="agendaDragOver(event)" ondragleave="agendaDragLeave(event)" ondrop="agendaDrop(event, '${ev.id}')" class="d-flex align-items-center mb-${mb} p-2" style="cursor:grab; background:#fdfdfd; border:1px solid #f1f1f1; border-radius:6px; opacity: ${opacity}; transition:all 0.2s;">
                            <div style="width:12px; height:12px; border-radius:50%; background-color:${color}; margin-right:12px; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.1);"></div>
                            <div class="flex-grow-1" style="text-decoration: ${textDeco}; line-height: 1.2;">
                                <div class="font-weight-bold" style="color: #333; font-size: 13px;">${ev.title}</div>
                                ${ev.isAdmin ? '<div class="badge badge-primary mt-1" style="font-size:9px;">YETKİLİ</div>' : ''}
                            </div>
                            <div class="text-muted" style="font-size: 11px; font-weight:600; background:#f0f0f0; padding:4px 8px; border-radius:12px; pointer-events:none;">
                                <i class="far fa-clock"></i> ${timeStr}
                            </div>
                        </div>
                    `;
                });
                
                if (todayEvents.length > 4) {
                    eventsHtml += `</div>`;
                    
                    const btnText = window.agendaWidgetExpanded ? 'Daha Az Gör <i class="fas fa-chevron-up" style="margin-left:4px;"></i>' : `Tümünü Gör (+${todayEvents.length - 4}) <i class="fas fa-chevron-down" style="margin-left:4px;"></i>`;
                    eventsHtml += `
                        <div class="text-center mt-2">
                            <button onclick="toggleAgendaExtraEvents()" class="btn btn-sm" style="font-size: 11px; font-weight: 600; color: #666; background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 20px; padding: 4px 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); outline:none; transition: all 0.2s;">
                                ${btnText}
                            </button>
                        </div>
                    `;
                }
                
                widgetEl.innerHTML = eventsHtml;
            } else {
                widgetEl.innerHTML = `
                    <div style="border-radius: 8px; padding: 15px; background: #fafafa; text-align: center; color: #aaa; border: 1px dashed #e6e6e6;">
                        <i class="far fa-calendar-times" style="font-size: 24px; margin-bottom: 8px; color:#ddd;"></i>
                        <div style="font-size: 12px; font-weight: 500;">${titleDate} tarihi için etkinlik bulunmuyor.</div>
                    </div>
                `;
            }
        };
    
// --- Script Block Extracted ---

// --- FAVORITES LOGIC ---
        const defaultFavorites = ['BULUT', 'ULAKBEL', 'E-POSTA', 'EBYS İÇİŞLERİ', 'ARAÇ TAKİP SİSTEMİ', 'PERSONEL TAKİP'];
        let favoritesList = [];
        try {
            let savedFavorites = localStorage.getItem('portal_favorites');
            favoritesList = savedFavorites ? JSON.parse(savedFavorites) : defaultFavorites;
        } catch (e) {
            favoritesList = defaultFavorites;
        }

        function renderFavorites() {
            const favoritesContainer = document.querySelector('.favorite-modules');
            const allModulesContainer = document.getElementById('allModulesContent');
            if(!favoritesContainer || !allModulesContainer) return;
            
            favoritesContainer.innerHTML = '';
            const allCards = allModulesContainer.querySelectorAll('.module-card');
            
            allCards.forEach(card => {
                const title = card.querySelector('strong').innerText.trim();
                const starIcon = card.querySelector('.star-btn');
                
                if (favoritesList.includes(title)) {
                    if(starIcon) {
                        starIcon.classList.remove('far');
                        starIcon.classList.add('fas');
                    }
                    const clone = card.closest('li').cloneNode(true);
                    const cloneStar = clone.querySelector('.star-btn');
                    if(cloneStar) {
                        cloneStar.setAttribute('onclick', `event.stopPropagation(); toggleFav(this, '${title}');`);
                    }
                    favoritesContainer.appendChild(clone);
                } else {
                    if(starIcon) {
                        starIcon.classList.remove('fas');
                        starIcon.classList.add('far');
                    }
                }
            });
        }

        window.toggleFav = function(element, title) {
            if (favoritesList.includes(title)) {
                favoritesList = favoritesList.filter(item => item !== title);
            } else {
                favoritesList.push(title);
            }
            localStorage.setItem('portal_favorites', JSON.stringify(favoritesList));
            renderFavorites();
        };

        
        document.addEventListener('DOMContentLoaded', function() {
            renderFavorites();
            
            const modullerToggle = document.getElementById('modullerToggle');
            const allModulesContent = document.getElementById('allModulesContent');
            
            if(modullerToggle && allModulesContent) {
                // Initialize based on checkbox state
                if(!modullerToggle.checked) {
                    allModulesContent.style.display = 'none';
                }
                
                modullerToggle.addEventListener('change', function() {
                    if(this.checked) {
                        allModulesContent.style.display = 'block';
                    } else {
                        allModulesContent.style.display = 'none';
                    }
                });
            }
        });

    
// --- Script Block Extracted ---

        document.addEventListener('DOMContentLoaded', function() {
            // --- DOĞUM GÜNÜ MANTIĞI (Dinamik Enjeksiyon) ---
            const employeeName = localStorage.getItem('portal_username') || "Ahmet Bey";
            
            // --- SAHTE (MOCK) VERİTABANI ---
            const today = new Date();
            const currentMonthDay = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            
            const mockBirthdays = {
                "personel1": "07-27", // Bugüne ayarlandı (Test için)
                "ahmet": "10-15",
                "mehmet": "01-01"
            };
            
            const isBirthdayToday = (mockBirthdays[employeeName.toLowerCase()] === currentMonthDay);
            const todayDateString = today.toISOString().split('T')[0];
            const lastCelebrated = localStorage.getItem('portal_birthday_celebrated_2');

            if (isBirthdayToday && lastCelebrated !== todayDateString) {
                // Sayfa yüklendikten kısa bir süre sonra sürprizi patlat
                setTimeout(() => {
                    // Confetti Konfeti Animasyonu
                    var duration = 4 * 1000;
                    var animationEnd = Date.now() + duration;
                    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999999 };

                    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

                    var interval = setInterval(function() {
                        var timeLeft = animationEnd - Date.now();
                        if (timeLeft <= 0) return clearInterval(interval);
                        var particleCount = 50 * (timeLeft / duration);
                        
                        confetti(Object.assign({}, defaults, { particleCount,
                            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                        }));
                        confetti(Object.assign({}, defaults, { particleCount,
                            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                        }));
                    }, 250);
                    
                    // Dinamik Olarak Saf HTML Pop-up Enjekte Et
                    const existingOverlay = document.getElementById('customBirthdayOverlay');
                    if (!existingOverlay) {
                        const overlayHtml = `
                        <div id="customBirthdayOverlay" style="display: flex; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.3); z-index: 2147483647; justify-content: center; align-items: center; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);">
                            <div style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(244,246,249,0.95) 100%); border-radius: 20px; padding: 40px; text-align: center; max-width: 450px; width: 90%; box-shadow: 0 15px 35px rgba(0,0,0,0.2); animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid rgba(255,255,255,0.5);">
                                <style>
                                @keyframes popIn {
                                    0% { opacity: 0; transform: scale(0.8); }
                                    100% { opacity: 1; transform: scale(1); }
                                }
                                </style>
                                <div style="font-size: 65px; margin-bottom: 15px; line-height: 1;">🎂</div>
                                <h2 style="color: #ff3366; font-family: 'Inter', sans-serif; font-weight: 800; margin-bottom: 15px;">İyi Ki Doğdun!</h2>
                                <h4 style="color: #333; font-weight: 700; margin-bottom: 20px; font-size: 24px;">${employeeName.toUpperCase()}</h4>
                                <p style="color: #666; font-size: 16px; margin-bottom: 30px; line-height: 1.5;">
                                    Yeni yaşının sana sağlık, mutluluk ve başarı getirmesini dileriz.<br>
                                    Seninle çalışmaktan gurur duyuyoruz! 🎉
                                </p>
                                <button onclick="document.getElementById('customBirthdayOverlay').style.display='none';" style="background: linear-gradient(45deg, #ff3366, #ff7b54); color: white; border: none; padding: 12px 35px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 5px 15px rgba(255,51,102,0.4); cursor: pointer;">
                                    Teşekkür Ederim
                                </button>
                            </div>
                        </div>`;
                        document.body.insertAdjacentHTML('beforeend', overlayHtml);
                    } else {
                        existingOverlay.style.display = 'flex';
                    }
                    
                    // Bugünü tarayıcı hafızasına kaydet
                    localStorage.setItem('portal_birthday_celebrated_2', todayDateString);
                }, 800);
            }
        });
    
// --- Script Block Extracted ---

        const moduleData = {
    'BULUT': {
        icon: 'fas fa-cloud',
        desc: 'Sistem üzerinden dosya saklayabilir, ofis dokümanlarınızı online olarak oluşturabilir ve düzenleyebilirsiniz. Sistemdeki dosyalarınızı link ile paylaşabilir, dış kaynaklardan veri aktarabilirsiniz. Bulut Mail, Bulut Not, Tahta gibi uygulamaları kullanabilirsiniz.',
        showPics: false,
        buttons: [
            { label: 'ANDROİD UYGULAMA', url: 'https://play.google.com/store/apps/details?id=com.netdatasoft.android.melikgazibulut&hl=en_GB&gl=US' },
            { label: 'İOS UYGULAMA', url: 'https://apps.apple.com/tr/app/divvydrive-business/id6566188262' },
            { label: 'WEB UYGULAMA', url: 'https://bulut.melikgazi.bel.tr/app/tr-TR/App/Transfer/MelikgaziBulut' }
        ]
    },
    'ULAKBEL': {
        icon: 'fas fa-paper-plane',
        desc: 'Melikgazi Belediyesi İletişim Yönetim Sistemi',
        showPics: false,
        buttons: [
            { label: 'WEB UYGULAMASI', url: 'https://ulakbel.melikgazi.bel.tr/ulakbel#/' },
            { label: 'İOS UYGULAMA', url: 'https://apps.apple.com/tr/app/ulakbell/id1436516167' },
            { label: 'ANDROİD UYGULAMA', url: 'https://play.google.com/store/apps/details?id=tr.com.emsal.ulakbelmobil&hl=tr&gl=US&pli=1' }
        ]
    },
    'CBS': {
        icon: 'fas fa-map-marked-alt',
        desc: 'Coğrafi Bilgi Sistemleri (CBS) Portalı',
        showPics: false,
        buttons: [
            { label: 'UYGULAMAYA GİT', url: 'https://cbs.melikgazi.bel.tr/portal/apps/sites/#/melikgazi-cbs-portal-1' }
        ]
    },
    'MOBEL': {
        icon: 'fas fa-mobile-alt',
        desc: 'Mobel Yönetim Bilgi Sistemi',
        showPics: false,
        buttons: [
            { label: 'UYGULAMAYA GİT', url: 'https://mobel.melikgazi.bel.tr/display.doms?pg=index&_mod=1785141305032' }
        ]
    },
    'GEODI': {
        icon: 'fas fa-search',
        desc: 'Geodi Arama Motoru ve Doküman Yönetimi',
        showPics: false,
        buttons: [
            { label: 'UYGULAMAYA GİT', url: 'https://geodi.melikgazi.bel.tr' }
        ]
    },
    'E-POSTA': {
        icon: 'fas fa-envelope',
        desc: '',
        showPics: false,
        buttons: [
            { label: 'YENİ E-POSTA TALEBİ', url: 'https://ulakbel.melikgazi.bel.tr/ulakbel#/' },
            { label: 'KURUMSAL E-POSTA ARAYÜZÜNE GİR', url: 'https://posta.melikgazi.bel.tr/webmail/logon' }
        ]
    },
    'EBYS İÇİŞLERİ': {
        icon: 'fas fa-file-signature',
        desc: 'İçişleri Bakanlığı Elektronik Belge Yönetim Sistemi',
        showPics: false,
        buttons: [
            { label: 'ARKSİGNER İNDİR', url: 'https://downloads.arksigner.com/files/ArkSigner-Installer-StandardUser-v2.2.4.exe' },
            { label: 'YENİ UYGULAMA', url: 'https://giris.belediye.gov.tr/Login.aspx?IsApplicationRequest=true' },
            { label: 'ŞİFREMİ UNUTTUM', url: 'https://uygulama.belediye.gov.tr/IBYetki/Login.aspx' }
        ]
    },
    'İŞ ZEKASI - RAPORLAMA': {
        icon: 'fas fa-chart-line',
        desc: 'İş Zekası ve Raporlama Platformu',
        showPics: false,
        buttons: [
            { label: 'SİSTEME GİRİŞ YAP', url: 'https://sso.online.tableau.com/public/idp/SSO' }
        ]
    },
    'ARAÇ TAKİP SİSTEMİ': {
        icon: 'fas fa-car',
        desc: 'Arvento Araç Takip Sistemi',
        showPics: false,
        buttons: [
            { label: 'SİSTEME GİRİŞ YAP', url: 'https://web.arvento.com/signin.aspx' }
        ]
    },
    'PERSONEL TAKİP': {
        icon: 'fas fa-users',
        desc: 'Personel Devam Kontrol ve Takip Sistemi',
        showPics: false,
        buttons: [{ label: 'GİRİŞ YAP', url: 'http://pdks.melikgazi.bel.tr' }]
    },
    'WEB İÇERİK YÖNETİM SİSTEMİ': {
        icon: 'fas fa-globe',
        desc: 'Kurumsal Web Sitesi İçerik Yönetim Paneli',
        showPics: false,
        buttons: [
            { label: 'YÖNETİM PANELİNE GİR', url: 'https://www.melikgazi.bel.tr/MelBelYP/giris.php' }
        ]
    },
    'KAMUTECH': {
        icon: 'fas fa-cogs',
        desc: 'Kamutech Yazılım Platformu',
        showPics: false,
        buttons: [
            { label: 'SİSTEME GİRİŞ YAP', url: 'https://kayseri.kamutech.com/uye-giris?ReturnUrl=%2Forganizasyon-sec' }
        ]
    },
    'TESİS': {
        icon: 'fas fa-building',
        desc: 'Sosyal yardım, kültür merkezleri ve akıl küpü çalışma istasyonlarının tek merkezde yönetileceği tesis melikgazi uygulaması.',
        showPics: false,
        buttons: [
            { label: 'UYGULAMAYA GİT', url: 'https://tesis.melikgazi.bel.tr/SistemeGiris.aspx' }
        ]
    },
    'KARİYER': {
        icon: 'fas fa-user-tie',
        desc: 'Melikgazi Belediyesi Kariyer Portalı',
        showPics: false,
        buttons: [
            { label: 'PORTALA GİT', url: 'https://kariyer.melikgazi.bel.tr' }
        ]
    },
    'VGA': {
        icon: 'fas fa-file-medical',
        desc: 'Kurumsal verilerin Geodi platformuna aktarılması amacıyla geliştirilmiş veri giriş arayüzü programı.',
        showPics: false,
        buttons: [
            { label: 'UYGULAMAYA GİT', url: 'http://vga.melikgazi.bel.tr/display.doms?pg=index' }
        ]
    },
    'İŞ SAĞLIĞI VE GÜVENLİĞİ': {
        icon: 'fas fa-hard-hat',
        desc: 'İş Sağlığı ve Güvenliği Bilgi Sistemi',
        showPics: false,
        buttons: [
            { label: 'SİSTEME GİRİŞ YAP', url: 'https://ibys.melikgazi.bel.tr' }
        ]
    },
    'KENTSEL DÖNÜŞÜM İŞ TAKİBİ': {
        icon: 'fas fa-tools',
        desc: 'Kentsel Dönüşüm Projeleri ve İş Takip Sistemi',
        showPics: false,
        buttons: [
            { label: 'SİSTEME GİRİŞ YAP', url: 'https://kentsel.melikgazi.bel.tr/Security/Login?ReturnUrl=%2f' }
        ]
    },
    'ARŞİV': {
        icon: 'fas fa-archive',
        desc: 'Dijital Arşiv ve Doküman Yönetimi',
        showPics: false,
        buttons: [
            { label: 'ARŞİVE GİT', url: 'https://arsiv.melikgazi.bel.tr/authentication/login/?next=/home/%3F/' }
        ]
    },
    'SIFIR ATIK': {
        icon: 'fas fa-leaf',
        desc: 'Sıfır Atık Yönetim Portalı',
        showPics: false,
        buttons: [
            { label: 'PORTALA GİT', url: 'https://sifiratik.melikgazi.bel.tr' }
        ]
    },
    'TRANSKRİPTOR': {
        icon: 'fas fa-headset',
        desc: 'Transkriptor Ses-Metin Çeviri Sistemi',
        showPics: false,
        buttons: [
            { label: 'SİSTEME GİRİŞ YAP', url: 'https://app.transkriptor.com/signin' }
        ]
    },
    'MGAZİ.Lİ - QR LİNK': {
        icon: 'fas fa-qrcode',
        desc: 'Kurumsal Kısa Link ve QR Kod Oluşturucu',
        showPics: false,
        buttons: [
            { label: 'SİSTEME GİRİŞ YAP', url: 'https://mgazi.li/login' }
        ]
    },
    'MECLİS': {
        icon: 'fas fa-landmark',
        desc: 'Belediye Meclis Bilgi Sistemi',
        showPics: false,
        buttons: [
            { label: 'SİSTEME GİRİŞ YAP', url: 'https://meclis.melikgazi.bel.tr/login' }
        ]
    },
    'SAHİPLEN': {
        icon: 'fas fa-paw',
        desc: 'Hayvan Sahiplendirme Portalı',
        showPics: false,
        buttons: [
            { label: 'PORTALA GİT', url: 'https://sahiplen.melikgazi.bel.tr' }
        ]
    },
    'META': {
        icon: 'fas fa-desktop',
        desc: 'Melikgazi Metaverse Portalı',
        showPics: false,
        buttons: [
            { label: 'PORTALA GİT', url: 'https://meta.melikgazi.bel.tr' }
        ]
    },
    'E-İMAR': {
        icon: 'fas fa-building',
        desc: 'Elektronik İmar Durumu ve Yapı Belgeleri',
        showPics: false,
        buttons: [
            { label: 'SİSTEME GİRİŞ YAP', url: 'https://imar.melikgazi.bel.tr/YapiBelgeleriWeb/Kullanici' }
        ]
    }
};

        window.openModuleModal = function(element, moduleName) {
            console.log("Bootstrap Modal triggered for:", moduleName);
            
            const data = moduleData[moduleName] || {
                icon: 'fas fa-cube',
                desc: moduleName + ' modülü detayları çok yakında eklenecektir.',
                showPics: false,
                buttons: ['GİRİŞ YAP']
            };

            const keepModal = ['BULUT', 'EBYS İÇİŞLERİ', 'E-POSTA', 'TESİS', 'ULAKBEL', 'VGA'];
            if (!keepModal.includes(moduleName)) {
                let url = '#';
                if (data.buttons && data.buttons.length > 0) {
                    if (typeof data.buttons[0] === 'string') {
                        url = '#'; // ignore old string format
                    } else if (data.buttons[0].url) {
                        url = data.buttons[0].url;
                    }
                }
                
                if (url !== '#' && url !== '') {
                    window.open(url, '_blank');
                } else {
                    // alert removed
                }
                return;
            }

            // Title and Icon
            const titleEl = document.getElementById('modalModuleTitle');
            if(titleEl) titleEl.innerText = moduleName;
            
            const iconEl = document.getElementById('modalModuleIcon');
              if(iconEl) {
                  if(data.image) {
                      iconEl.className = '';
                      iconEl.style.display = 'inline-block';
                      iconEl.style.width = '48px';
                      iconEl.style.height = '48px';
                      iconEl.style.backgroundImage = "url('" + data.image + "')";
                      iconEl.style.backgroundSize = 'contain';
                      iconEl.style.backgroundPosition = 'center';
                      iconEl.style.backgroundRepeat = 'no-repeat';
                  } else {
                      iconEl.style.backgroundImage = 'none';
                      iconEl.className = data.icon + ' fa-lg';
                      iconEl.style.color = '#4ba3e3';
                  }
              }
            
            // Description
            const descEl = document.getElementById('modalModuleDesc');
            if(descEl) {
                if(data.desc) {
                    descEl.innerText = data.desc;
                    descEl.style.display = 'block';
                } else {
                    descEl.style.display = 'none';
                }
            }
            
            // Image link
            const resimLink = document.querySelector('#moduleModal .resim-link');
            if(resimLink) {
                resimLink.style.display = data.showPics ? 'inline-block' : 'none';
            }

            // Buttons
            const btnsEl = document.getElementById('modalLinksContainer');
            if(btnsEl) {
                btnsEl.innerHTML = '';
                data.buttons.forEach(btnObj => {
                    const btn = document.createElement('button');
                    btn.className = 'btn';
                    btn.style.width = '100%';
                    btn.style.padding = '8px 10px'; btn.style.fontSize = '12px';
                    btn.style.borderRadius = '8px';
                    btn.style.backgroundColor = '#4ba3e3';
                    btn.style.color = '#fff';
                    btn.style.fontWeight = '600';
                    btn.style.border = 'none';
                    btn.style.transition = 'all 0.2s';
                    btn.onmouseover = () => btn.style.backgroundColor = '#3498db';
                    btn.onmouseout = () => btn.style.backgroundColor = '#4ba3e3';
                    
                    // Geriye dönük uyumluluk (eger eski string ise)
                    const isObj = typeof btnObj === 'object';
                    const label = isObj ? btnObj.label : btnObj;
                    const url = isObj ? btnObj.url : '#';
                    
                    btn.innerText = label;
                    btn.onclick = function(e) {
                        if (url && url !== '#') {
                            window.open(url, '_blank');
                        } else {
                            e.preventDefault();
                            alert("Tıklanan buton: " + label + " (Henüz link eklenmedi!)");
                        }
                    };
                    btnsEl.appendChild(btn);
                });
            }

            // Show modal
            if (typeof $ !== 'undefined' && $.fn.modal) {
                $('#moduleModal').modal('show');
            } else {
                alert("HATA: JQuery veya Bootstrap yuklenmemis! Sayfayi yenileyin.");
            }
        }
    
// --- Script Block Extracted ---

      // MIGRATION SCRIPT: Move misplaced admin events to portal_ajanda
      (function() {
          try {
              let personalKey = 'portal_agenda_events_admin_personal';
              let personalEventsStr = localStorage.getItem(personalKey);
              if (personalEventsStr) {
                  let personalEvents = JSON.parse(personalEventsStr);
                  let misplaced = personalEvents.filter(e => e.isAdmin === true);
                  
                  if (misplaced.length > 0) {
                      let portalAjanda = JSON.parse(localStorage.getItem('portal_ajanda')) || [];
                      misplaced.forEach(ev => {
                          portalAjanda.push({
                              id: Date.now() + Math.floor(Math.random()*1000), // new ID to avoid conflict
                              baslangic: ev.date,
                              bitis: ev.date,
                              baslik: ev.title,
                              aciklama: '',
                              aktif: true,
                              ekleyen: 'admin',
                              kayitTarihi: new Date().toLocaleString('tr-TR')
                          });
                      });
                      
                      localStorage.setItem('portal_ajanda', JSON.stringify(portalAjanda));
                      
                      // Remove them from personal storage
                      let remainingPersonal = personalEvents.filter(e => e.isAdmin !== true);
                      localStorage.setItem(personalKey, JSON.stringify(remainingPersonal));
                      console.log("Migrated " + misplaced.length + " misplaced admin events!");
                  }
              }
          } catch(e) {
              console.error("Migration failed:", e);
          }
      })();
      
// --- Script Block Extracted ---

      // LEGACY CLEANUP SCRIPT: Delete old buggy admin storage keys
      (function() {
          try {
              localStorage.removeItem('portal_agenda_events_admin');
              localStorage.removeItem('portal_agenda_events_admin_personal');
              console.log("Legacy admin event storages cleared to fix stuck events.");
          } catch(e) {
              console.error(e);
          }
      })();
      
// --- Script Block Extracted ---

    // INJECT CUSTOM MODULES FROM LOCAL STORAGE
    (function() {
        try {
            let customMods = JSON.parse(localStorage.getItem('portal_custom_modules')) || [];
            if(customMods.length > 0) {
                const allModulesList = document.getElementById('allModulesList');
                if(allModulesList) {
                    customMods.forEach(mod => {
                        let clickHandler = `window.open('${mod.url}', '_blank')`;
                        
                        let li = document.createElement('li');
                        li.className = 'col-6 col-sm-4 col-md-3 col-xl-2 custom-module';
                        li.innerHTML = `
                            <div class="module-card" onclick="${clickHandler}">
                                <i class="far fa-star star-btn" onclick="event.stopPropagation(); alert('Özel modüller henüz favorilere eklenemiyor.');"></i>
                                <div class="img-container" style="display:flex; justify-content:center; align-items:center; height: 60px; margin-bottom: 15px;">
                                    <i class="${mod.icon} fa-2x" style="color: #4ba3e3; filter: drop-shadow(0px 3px 4px rgba(75,163,227,0.25));"></i>
                                </div>
                                <strong>${mod.title}</strong>
                            </div>
                        `;
                        allModulesList.appendChild(li);
                    });
                }
            }
        } catch(e) { console.error("Custom modules load error:", e); }
    })();
    
// --- Script Block Extracted ---

// --- YEMEK MENÜSÜ DİNAMİK MANTIK ---
        let currentYemekDate = new Date(); // Bugünün tarihi

        function getYemekDataFromLocal() {
            let data = {};
            try {
                const raw = localStorage.getItem('portal_yemek_menu');
                if (raw) data = JSON.parse(raw);
            } catch(e) {}
            return data;
        }

        function formatYemekDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
            return date.toLocaleDateString('tr-TR', options).toUpperCase();
        }

        function renderYemekMenu() {
            const dateStr = formatYemekDate(currentYemekDate);
            document.getElementById('yemek-date').innerText = dateStr;
            
            const year = currentYemekDate.getFullYear();
            const month = String(currentYemekDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentYemekDate.getDate()).padStart(2, '0');
            const localIsoDate = `${year}-${month}-${day}`;
            
            const menuList = document.getElementById('yemek-menu-list');
            if(menuList) {
                const data = getYemekDataFromLocal();
                if (data[localIsoDate]) {
                    menuList.innerHTML = data[localIsoDate].map(item => `<li style="font-weight: 600;">&bull; ${item}</li>`).join('');
                } else {
                    menuList.innerHTML = `<li style="font-weight: 400; color: #888;">&bull; Menü girilmedi.</li>`;
                }
            }
        }

        function changeYemekDate(offset) {
            currentYemekDate.setDate(currentYemekDate.getDate() + offset);
            renderYemekMenu();
        }

        // Sayfa yüklendiğinde menüyü çiz
        document.addEventListener('DOMContentLoaded', () => {
            renderYemekMenu();
        });
