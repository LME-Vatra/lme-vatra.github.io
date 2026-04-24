(function () {
    'use strict';

    function createConnector() {
      if (window.vatra_connector_ready) return null;
      window.vatra_connector_ready = true;
      var VC = {
        version: '0.0.7',
        COMPONENT: 'vatra_connector',
        L: {
          Storage: Lampa.Storage,
          Select: Lampa.Select,
          Bell: Lampa.Bell,
          Noty: Lampa.Noty,
          Input: Lampa.Input,
          Controller: Lampa.Controller,
          Manifest: Lampa.Manifest,
          Listener: Lampa.Listener,
          Settings: Lampa.Settings,
          SettingsApi: Lampa.SettingsApi,
          Head: Lampa.Head,
          Template: Lampa.Template,
          Lang: Lampa.Lang,
          Modal: Lampa.Modal
        },
        KEY: {
          api: 'vatra_connector_api',
          token: 'vatra_connector_token',
          refresh: 'vatra_connector_refresh',
          deviceId: 'vatra_connector_device_id',
          keyId: 'vatra_connector_key_id',
          profileId: 'vatra_connector_profile_id',
          profilePin: 'vatra_connector_profile_pin',
          pairingCode: 'vatra_connector_pair_code',
          pairTs: 'vatra_connector_pair_ts',
          uid: 'vatra_connector_uid',
          pub: 'vatra_connector_pubkey'
        },
        _reloadTimer: 0,
        _reloadModalOpen: false,
        _stateSyncTimers: {}
      };
      window.__vatraConnector = VC;
      return VC;
    }

    function initLang(VC) {
      var uk = {
        vatra_api_url: 'Базова адреса Vatra API',
        vatra_api_saved: 'Адресу API збережено',
        vatra_no_pending_pair: 'Немає коду підключення',
        vatra_pair_status: 'Статус підключення: {status}. Підтвердіть у порталі та повторіть.',
        vatra_connected: 'Vatra підключено',
        vatra_pair_failed_no_session: 'Помилка підключення: сесія відсутня',
        vatra_pair_failed: 'Помилка завершення підключення',
        vatra_pair_start_failed_no_code: 'Помилка початку підключення: код відсутній',
        vatra_pair_expired: 'Код підключення прострочено. Отримайте новий код.',
        vatra_pairing_title: 'Підключення Vatra',
        vatra_pair_approve_info: 'Підтвердіть код у порталі, потім натисніть «Завершити»',
        vatra_pair_start_failed: 'Помилка початку підключення',
        vatra_limit_soon_pair_start: 'Майже ліміт старту підключення. Лишилось спроб: {remaining}.',
        vatra_limit_hit_pair_start: 'Уперлись у ліміт старту підключення. Зачекайте 15 хвилин.',
        vatra_limit_soon_pair_approve: 'Майже ліміт підтверджень у порталі. Лишилось спроб: {remaining}.',
        vatra_limit_hit_pair_approve: 'Уперлись у ліміт підтверджень у порталі. Зачекайте 1 годину.',
        vatra_limit_soon_device_challenge: 'Майже ліміт перевірок пристрою. Лишилось спроб: {remaining}.',
        vatra_limit_hit_device_challenge: 'Уперлись у ліміт перевірок пристрою. Зачекайте 60 секунд.',
        vatra_limit_soon_pair_complete: 'Майже ліміт завершення підключення. Лишилось спроб: {remaining}.',
        vatra_limit_hit_pair_complete: 'Уперлись у ліміт завершення підключення. Потрібно почекати або створити новий код.',
        vatra_limit_hit_generic: 'Тимчасове обмеження на запити. Трохи зачекайте і спробуйте ще раз.',
        vatra_error_rate_limited: 'Забагато спроб. Трохи зачекайте і повторіть.',
        vatra_error_pairing_not_found: 'Код підключення не знайдено.',
        vatra_error_pairing_expired: 'Код підключення вже прострочений.',
        vatra_error_generic: 'Сталася помилка запиту',
        vatra_profiles_title: 'Профілі Vatra',
        vatra_profile_switched: 'Профіль переключено',
        vatra_profile_changed: 'Профіль змінено',
        vatra_profile_switch_failed: 'Помилка зміни профілю',
        vatra_profiles_load_failed: 'Помилка завантаження профілів',
        vatra_backup_exported: 'Бекап експортовано',
        vatra_backup_export_failed: 'Помилка експорту бекапу',
        vatra_backup_imported_count: 'Бекап імпортовано: {count} ключів.',
        vatra_backup_imported: 'Бекап імпортовано',
        vatra_backup_import_failed: 'Помилка імпорту бекапу',
        vatra_plugins_synced_dot: 'Розширення синхронізовано.',
        vatra_plugins_synced: 'Розширення синхронізовано',
        vatra_plugin_sync_failed: 'Помилка синхронізації розширень',
        vatra_cloud_plugins_failed: 'Помилка завантаження хмарних розширень',
        vatra_connection: 'Підключення',
        vatra_set_api_url: 'Встановити адресу API',
        vatra_reconnect_device: 'Перепідключити пристрій',
        vatra_connect_device: 'Підключити пристрій',
        vatra_complete_pending_pair: 'Завершити підключення',
        vatra_data: 'Дані',
        vatra_switch_profile: 'Змінити профіль',
        vatra_backup_export: 'Експорт бекапу',
        vatra_backup_import: 'Імпорт бекапу',
        vatra_sync_plugins: 'Синхронізувати розширення',
        vatra_disconnect: 'Відключити',
        vatra_cub_sync_enabled: 'Синхронізація CUB увімкнена. Вимкніть її для стабільної роботи Vatra.',
        vatra_disconnected_from: 'відключено від Vatra',
        vatra_status_connected: 'підключено',
        vatra_status_not_connected: 'не підключено'
      };
      var en = {
        vatra_api_url: 'Vatra API Base URL',
        vatra_api_saved: 'API URL saved',
        vatra_no_pending_pair: 'No pending pairing code',
        vatra_pair_status: 'Pair status: {status}. Confirm in portal and retry.',
        vatra_connected: 'Vatra connected',
        vatra_pair_failed_no_session: 'Pair complete failed: no session',
        vatra_pair_failed: 'Pair complete failed',
        vatra_pair_start_failed_no_code: 'Pair start failed: no code',
        vatra_pair_expired: 'Pairing code expired. Get a new code.',
        vatra_pairing_title: 'Vatra Pairing',
        vatra_pair_approve_info: 'Approve code in portal, then press Complete',
        vatra_pair_start_failed: 'Pair start failed',
        vatra_limit_soon_pair_start: 'Pair start limit is close. Attempts left: {remaining}.',
        vatra_limit_hit_pair_start: 'Pair start limit reached. Wait 15 minutes.',
        vatra_limit_soon_pair_approve: 'Pair approval limit is close. Attempts left: {remaining}.',
        vatra_limit_hit_pair_approve: 'Pair approval limit reached. Wait 1 hour.',
        vatra_limit_soon_device_challenge: 'Device challenge limit is close. Attempts left: {remaining}.',
        vatra_limit_hit_device_challenge: 'Device challenge limit reached. Wait 60 seconds.',
        vatra_limit_soon_pair_complete: 'Pair complete limit is close. Attempts left: {remaining}.',
        vatra_limit_hit_pair_complete: 'Pair complete limit reached. Wait or start a new pairing code.',
        vatra_limit_hit_generic: 'Too many requests. Please wait and try again.',
        vatra_error_rate_limited: 'Too many attempts. Please wait and retry.',
        vatra_error_pairing_not_found: 'Pairing code not found.',
        vatra_error_pairing_expired: 'Pairing code has expired.',
        vatra_error_generic: 'Request failed',
        vatra_profiles_title: 'Vatra Profiles',
        vatra_profile_switched: 'Profile switched',
        vatra_profile_changed: 'Profile changed',
        vatra_profile_switch_failed: 'Profile switch failed',
        vatra_profiles_load_failed: 'Profiles load failed',
        vatra_backup_exported: 'Backup exported',
        vatra_backup_export_failed: 'Backup export failed',
        vatra_backup_imported_count: 'Backup imported: {count} keys.',
        vatra_backup_imported: 'Backup imported',
        vatra_backup_import_failed: 'Backup import failed',
        vatra_plugins_synced_dot: 'Plugins synced.',
        vatra_plugins_synced: 'Plugins synced',
        vatra_plugin_sync_failed: 'Plugin sync failed',
        vatra_cloud_plugins_failed: 'Cloud plugins load failed',
        vatra_connection: 'Connection',
        vatra_set_api_url: 'Set API URL',
        vatra_reconnect_device: 'Reconnect Device',
        vatra_connect_device: 'Connect Device',
        vatra_complete_pending_pair: 'Complete Pending Pair',
        vatra_data: 'Data',
        vatra_switch_profile: 'Switch Profile',
        vatra_backup_export: 'Backup Export',
        vatra_backup_import: 'Backup Import',
        vatra_sync_plugins: 'Sync Plugins',
        vatra_disconnect: 'Disconnect',
        vatra_cub_sync_enabled: 'CUB Sync is enabled. Disable it for stable Vatra sync.',
        vatra_disconnected_from: 'disconnected from Vatra',
        vatra_status_connected: 'connected',
        vatra_status_not_connected: 'not connected'
      };
      var translations = {};
      Object.keys(uk).forEach(function (key) {
        translations[key] = {
          uk: uk[key],
          ru: uk[key],
          en: en[key] || uk[key]
        };
      });
      VC.L.Lang.add(translations);
    }

    function initHelpers(VC) {
      VC.toBool = function (value) {
        return value === true || value === 'true' || value === 1 || value === '1';
      };
      VC.statusLine = function () {
        return VC.token() ? 'connected' : 'not connected';
      };
      VC.cubSyncEnabled = function () {
        var storage = VC.L.Storage;
        var accountUse = VC.toBool(storage.get('account_use', false));
        var accountSync = VC.toBool(storage.get('account_sync', true));
        return accountUse && accountSync;
      };
      VC.notify = function (text) {
        return VC.L.Noty.show(text);
      };
      VC.bell = function (text) {
        var icon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
        var bell = VC.L && VC.L.Bell || window.Lampa && window.Lampa.Bell;
        if (bell && bell.push) {
          bell.push({
            text: text,
            icon: icon
          });
          return;
        }
        VC.notify(text);
      };
      VC.reloadAppSoon = function (reason, delayMs) {
        var delay = typeof delayMs === 'number' ? delayMs : 1500;
        if (VC._reloadModalOpen || VC._reloadTimer) return;
        var modal = VC.L.Modal;
        var lang = VC.L.Lang;
        if (modal && modal.open) {
          VC._reloadModalOpen = true;
          modal.open({
            title: '',
            align: 'center',
            zIndex: 300,
            html: $('<div class="about">' + lang.translate('plugins_need_reload') + '</div>'),
            buttons: [{
              name: lang.translate('settings_param_no'),
              onSelect: function onSelect() {
                VC._reloadModalOpen = false;
                modal.close();
              }
            }, {
              name: lang.translate('settings_param_yes'),
              onSelect: function onSelect() {
                VC._reloadModalOpen = false;
                window.location.reload();
              }
            }]
          });
          return;
        }
        VC.notify((reason || lang.translate('vatra_plugins_synced')) + '. ' + lang.translate('plugins_need_reload'));
        VC._reloadTimer = setTimeout(function () {
          return window.location.reload();
        }, delay);
      };
      VC.ensureCubSafe = function (actionTitle, proceed) {
        if (!VC.cubSyncEnabled()) {
          proceed();
          return;
        }
        var lang = VC.L.Lang;
        VC.L.Select.show({
          title: 'CUB Sync',
          items: [{
            title: lang.translate('vatra_cub_sync_enabled'),
            nosel: true
          }, {
            title: lang.translate('continue'),
            action: 'continue',
            selected: true
          }, {
            title: lang.translate('cancel')
          }],
          onSelect: function onSelect(sel) {
            if (sel.action === 'continue') proceed();
          },
          onBack: function onBack() {
            VC.L.Controller.toggle('settings_component');
          }
        });
        VC.notify(actionTitle + ': CUB Sync!');
      };
    }

    function _arrayLikeToArray(r, a) {
      (null == a || a > r.length) && (a = r.length);
      for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
      return n;
    }
    function _createForOfIteratorHelper(r, e) {
      var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
      if (!t) {
        if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
          t && (r = t);
          var n = 0,
            F = function () {};
          return {
            s: F,
            n: function () {
              return n >= r.length ? {
                done: true
              } : {
                done: false,
                value: r[n++]
              };
            },
            e: function (r) {
              throw r;
            },
            f: F
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var o,
        a = true,
        u = false;
      return {
        s: function () {
          t = t.call(r);
        },
        n: function () {
          var r = t.next();
          return a = r.done, r;
        },
        e: function (r) {
          u = true, o = r;
        },
        f: function () {
          try {
            a || null == t.return || t.return();
          } finally {
            if (u) throw o;
          }
        }
      };
    }
    function _typeof(o) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
        return typeof o;
      } : function (o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
      }, _typeof(o);
    }
    function _unsupportedIterableToArray(r, a) {
      if (r) {
        if ("string" == typeof r) return _arrayLikeToArray(r, a);
        var t = {}.toString.call(r).slice(8, -1);
        return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
      }
    }

    function initState(VC) {
      VC.apiBase = function () {
        return 'https://be.vatra.ovh';
      };
      VC.token = function () {
        return VC.L.Storage.get(VC.KEY.token, '');
      };
      VC.normalizeProfileId = function (value) {
        if (!value) return '';
        if (_typeof(value) === 'object') {
          return String(value.id || value.profileId || value.profile_id || '').trim();
        }
        var raw = String(value).trim();
        if (!raw || raw === '[object Object]') return '';
        if (raw[0] === '{') {
          try {
            var parsed = JSON.parse(raw);
            return VC.normalizeProfileId(parsed);
          } catch (e) {}
        }
        return raw;
      };
      VC.storageProfileId = function (key) {
        var raw = VC.L.Storage.get(key, '');
        var normalized = VC.normalizeProfileId(raw);
        if (raw && normalized !== raw) VC.L.Storage.set(key, normalized, true);
        return normalized;
      };
      VC.profile = function () {
        var pinned = VC.storageProfileId(VC.KEY.profilePin);
        if (pinned) return String(pinned);
        return String(VC.storageProfileId(VC.KEY.profileId) || '');
      };
      VC.deviceUid = function () {
        var uid = VC.L.Storage.get(VC.KEY.uid, '');
        if (!uid) {
          uid = 'vatra-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
          VC.L.Storage.set(VC.KEY.uid, uid);
        }
        return uid;
      };
      VC.keyId = function () {
        var id = VC.L.Storage.get(VC.KEY.keyId, '');
        if (!id) {
          id = 'vk-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
          VC.L.Storage.set(VC.KEY.keyId, id);
        }
        return id;
      };
      VC.publicKey = function () {
        var pub = VC.L.Storage.get(VC.KEY.pub, '');
        if (!pub) {
          var raw = '';
          for (var i = 0; i < 32; i++) raw += String.fromCharCode(Math.floor(Math.random() * 256));
          pub = btoa(raw);
          VC.L.Storage.set(VC.KEY.pub, pub);
        }
        return pub;
      };
      VC.saveSession = function (session) {
        var serverProfileId = VC.normalizeProfileId(session.profileId || session.profile);
        var pinnedProfileId = VC.storageProfileId(VC.KEY.profilePin);
        VC.L.Storage.set(VC.KEY.token, session.accessToken || '');
        VC.L.Storage.set(VC.KEY.refresh, session.refreshToken || '');
        VC.L.Storage.set(VC.KEY.deviceId, session.deviceId || '');
        VC.L.Storage.set(VC.KEY.keyId, session.keyId || VC.keyId());
        VC.L.Storage.set(VC.KEY.profileId, serverProfileId);
        if (!pinnedProfileId && serverProfileId) VC.L.Storage.set(VC.KEY.profilePin, serverProfileId);
        VC.L.Storage.set(VC.KEY.pairingCode, '');
      };
      VC.disconnect = function () {
        VC.L.Storage.set(VC.KEY.token, '');
        VC.L.Storage.set(VC.KEY.refresh, '');
        VC.L.Storage.set(VC.KEY.deviceId, '');
        VC.L.Storage.set(VC.KEY.profileId, '');
        VC.L.Storage.set(VC.KEY.profilePin, '');
        VC.L.Storage.set(VC.KEY.pairingCode, '');
        VC.notify(VC.L.Lang.translate('vatra_disconnected_from'));
      };
    }

    function initProfileState(VC) {
      VC.PROFILE_STATE_KEYS = [
        // Connector-specific keys only — Lampa state (favorite, timetable, file_view, etc.)
        // is now managed natively by Lampa APIs, not stored in vatra_profile_state_*
      ];
      VC.PROFILE_STATE_DEFAULTS = {
        // No defaults — Lampa handles its own state
      };

      // --- Removed: legacy helpers for Lampa state storage (no longer used) ---
      // VC.profileStateStorageKey, cloneProfileStateDefault, normalizeProfileStateValue,
      // readProfileStateSnapshot, profileStateValue — all removed as Lampa state is native

      VC.saveCurrentProfileLocalState = function (profileId) {
        // No-op: Lampa state is managed natively; no VC-local state to save
        // Kept for API compatibility with callers (profiles.js, init.js)
        return;
      };
      VC.applyProfileLocalState = function (profileId) {
        if (!profileId) return;

        // Lampa manages its own state natively; just refresh from Lampa storage
        if (Lampa.Favorite && Lampa.Favorite.read) Lampa.Favorite.read(true);
        if (Lampa.Timeline && Lampa.Timeline.read) Lampa.Timeline.read(true);

        // Notify that profile-local state has been applied (for UI updates)
        Lampa.Listener.send('state:changed', {
          target: 'profile_state',
          reason: 'apply',
          profileId: profileId
        });
      };
      VC.refreshProfileRuntimeState = function () {
        if (Lampa.Favorite && Lampa.Favorite.read) Lampa.Favorite.read(true);
        if (Lampa.Timeline && Lampa.Timeline.read) Lampa.Timeline.read(true);
      };
    }

    function initDevice(VC) {
      var UA = navigator.userAgent || '';
      var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      var _platform = null;
      var _deviceType = null;
      var _osVersion = null;

      // OS version extraction helpers
      var extractVersion = function extractVersion(patterns) {
        var _iterator = _createForOfIteratorHelper(patterns),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _step$value = _step.value,
              re = _step$value.re,
              _step$value$idx = _step$value.idx,
              idx = _step$value$idx === void 0 ? 1 : _step$value$idx;
            var m = UA.match(re);
            if (m) return m[idx];
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return null;
      };

      // Detect platform synchronously
      var detectPlatform = function detectPlatform() {
        // 1. webOS (LG Smart TV)
        if (window.webOS && webOS.platform && webOS.platform.tv === true) {
          return 'webos';
        }

        // 2. Tizen (Samsung Smart TV)
        if (window.tizen && tizen.tvinputdevice) {
          return 'tizen';
        }

        // 3. Electron (Desktop app)
        if (UA.includes('Electron')) {
          return 'electron';
        }

        // 4. iOS / iPhone / iPad / iPod (covers mobile Safari)
        if (/iPhone|iPad|iPod/i.test(UA)) {
          return 'ios';
        }

        // 4a. iPad in desktop mode: Mac OS X UA but touch-enabled
        if (/Mac OS X/i.test(UA) && isTouch) {
          return 'ios';
        }

        // 5. Android (both mobile and TV)
        if (/Android/i.test(UA)) {
          return 'android';
        }

        // 6. Apple TV: explicit AppleTV keyword OR iPhone OS UA + no touch + large screen
        if (/AppleTV/i.test(UA) || /CPU iPhone OS/i.test(UA) && !isTouch && screen && screen.width >= 1920) {
          return 'appletv';
        }

        // 7. macOS (desktop Safari/Chrome — not touch-enabled)
        if (/Mac OS X/i.test(UA)) {
          return 'macos';
        }

        // 8. Windows
        if (/Windows NT/i.test(UA)) {
          return 'windows';
        }

        // 9. Linux
        if (/Linux/i.test(UA)) {
          return 'linux';
        }

        // Fallback
        return 'browser';
      };

      // Detect OS version from UA
      var detectOsVersion = function detectOsVersion(platform) {
        var patterns = {
          android: [{
            re: /Android\s+([0-9]+(?:\.[0-9]+)*)/i,
            idx: 1
          }, {
            re: /Android\s+([0-9]+)/i,
            idx: 1
          }],
          ios: [{
            re: /iPhone OS\s+([0-9_]+)/i,
            idx: 1
          }, {
            re: /CPU iPhone OS\s+([0-9_]+)/i,
            idx: 1
          }, {
            re: /iPad.*OS\s+([0-9_]+)/i,
            idx: 1
          }, {
            re: /iPod.*OS\s+([0-9_]+)/i,
            idx: 1
          }],
          macos: [{
            re: /Mac OS X\s+([0-9_]+)/i,
            idx: 1
          }, {
            re: /Mac OS X\s+10_([0-9_]+)/i,
            idx: 1
          }],
          windows: [{
            re: /Windows NT\s+([0-9]+(?:\.[0-9]+)?)/i,
            idx: 1
          }, {
            re: /Windows\s+([0-9]+(?:\.[0-9]+)?)/i,
            idx: 1
          }],
          appletv: [{
            re: /CPU iPhone OS\s+([0-9_]+)/i,
            idx: 1
          }]
        };
        var p = patterns[platform];
        if (!p) return null;
        var raw = extractVersion(p);
        if (!raw) return null;

        // Normalize underscores to dots (iOS: 16_5 -> 16.5)
        return raw.replace(/_/g, '.');
      };

      // Build user-friendly device type name
      var buildDeviceType = function buildDeviceType(platform) {
        UA.toLowerCase();
        if (platform === 'webos') {
          return 'webOS TV';
        }
        if (platform === 'tizen') {
          return 'Tizen TV';
        }
        if (platform === 'appletv') {
          return 'Apple TV';
        }
        if (platform === 'android') {
          return isTouch ? 'Android Phone' : 'Android TV';
        }
        if (platform === 'ios') {
          return /ipad/i.test(UA) ? 'iPad' : 'iPhone';
        }
        if (platform === 'electron') {
          return 'Electron App';
        }
        if (platform === 'macos') {
          return 'Mac';
        }
        if (platform === 'windows') {
          return 'Windows PC';
        }
        if (platform === 'linux') {
          return 'Linux PC';
        }
        return 'Browser';
      };

      // Build user-friendly display name
      var buildDisplayName = function buildDisplayName(platform, deviceType) {
        var manifest = VC.L && VC.L.Manifest;
        var appName = manifest && manifest.name ? manifest.name : 'Vatra';
        if (platform === 'webos') {
          return "Lampa (".concat(deviceType, ")");
        }
        if (platform === 'tizen') {
          return "Lampa (".concat(deviceType, ")");
        }
        if (platform === 'appletv') {
          return "Lampa (".concat(deviceType, ")");
        }
        if (platform === 'android') {
          return "Lampa (".concat(deviceType, ")");
        }
        if (platform === 'ios') {
          return "".concat(appName, " (").concat(deviceType, ")");
        }
        if (platform === 'electron') {
          return "".concat(appName, " Desktop");
        }
        if (platform === 'macos' || platform === 'windows' || platform === 'linux') {
          return "".concat(appName, " (").concat(deviceType, ")");
        }
        return "Vatra Connector";
      };

      // Public API
      VC.Device = {
        init: function init() {
          _platform = detectPlatform();
          _deviceType = buildDeviceType(_platform);
          _osVersion = detectOsVersion(_platform);
        },
        getPlatform: function getPlatform() {
          if (_platform === null) this.init();
          return _platform;
        },
        isTV: function isTV() {
          if (_platform === null) this.init();
          return _platform === 'webos' || _platform === 'tizen' || _platform === 'appletv' || _platform === 'android' && !isTouch;
        },
        isMobile: function isMobile() {
          if (_platform === null) this.init();
          return _platform === 'android' && isTouch || _platform === 'ios';
        },
        isDesktop: function isDesktop() {
          if (_platform === null) this.init();
          return _platform === 'macos' || _platform === 'windows' || _platform === 'linux' || _platform === 'electron' || _platform === 'browser';
        },
        getDeviceType: function getDeviceType() {
          if (_deviceType === null) this.init();
          return _deviceType;
        },
        getDisplayName: function getDisplayName() {
          if (_deviceType === null) this.init();
          return buildDisplayName(_platform, _deviceType);
        },
        getOsVersion: function getOsVersion() {
          if (_osVersion === null) this.init();
          return _osVersion || null;
        },
        getAppVersion: function getAppVersion() {
          var manifest = VC.L && VC.L.Manifest;
          return manifest && manifest.app_version ? manifest.app_version : null;
        },
        getInfo: function getInfo() {
          if (_platform === null) this.init();
          return {
            platform: _platform,
            deviceType: _deviceType,
            osVersion: _osVersion || null,
            appVersion: this.getAppVersion()
          };
        },
        // Debug helper
        _getUserAgent: function _getUserAgent() {
          return UA;
        },
        _isTouchDevice: function _isTouchDevice() {
          return isTouch;
        }
      };

      // Auto-init on module load
      VC.Device.init();
    }

    function initApi(VC) {
      var RATE_LIMIT_RULES = {
        '/connector/v1/pair/start': {
          limit: 5,
          windowMs: 15 * 60 * 1000,
          warnAt: 4,
          soonKey: 'vatra_limit_soon_pair_start',
          hitKey: 'vatra_limit_hit_pair_start'
        },
        '/connector/v1/pair/approve': {
          limit: 20,
          windowMs: 60 * 60 * 1000,
          warnAt: 16,
          soonKey: 'vatra_limit_soon_pair_approve',
          hitKey: 'vatra_limit_hit_pair_approve'
        },
        '/connector/v1/device/challenge': {
          limit: 60,
          windowMs: 60 * 1000,
          warnAt: 50,
          soonKey: 'vatra_limit_soon_device_challenge',
          hitKey: 'vatra_limit_hit_device_challenge'
        }
      };
      VC._rateLimitState = VC._rateLimitState || {};
      var rateWindowState = function rateWindowState(path) {
        var rule = RATE_LIMIT_RULES[path];
        if (!rule) return null;
        var now = Date.now();
        var state = VC._rateLimitState[path];
        if (!state || now - state.windowStart >= rule.windowMs) {
          state = {
            windowStart: now,
            count: 0,
            warned: false
          };
          VC._rateLimitState[path] = state;
        }
        return {
          rule: rule,
          state: state
        };
      };
      VC.trackRateLimitProgress = function (path) {
        var ctx = rateWindowState(path);
        if (!ctx) return;
        var rule = ctx.rule,
          state = ctx.state;
        state.count += 1;
        if (state.count >= rule.warnAt && !state.warned) {
          var remaining = Math.max(rule.limit - state.count, 0);
          VC.bell(VC.L.Lang.translate(rule.soonKey, {
            remaining: remaining
          }));
          state.warned = true;
        }
      };
      VC.notifyRateLimited = function (path, code) {
        if (code === 'PAIRING_ATTEMPTS_EXCEEDED') {
          VC.bell(VC.L.Lang.translate('vatra_limit_hit_pair_complete'));
          return;
        }
        var rule = RATE_LIMIT_RULES[path];
        if (rule) {
          VC.bell(VC.L.Lang.translate(rule.hitKey));
          return;
        }
        VC.bell(VC.L.Lang.translate('vatra_limit_hit_generic'));
      };
      VC.apiErrorText = function (error, fallbackKey) {
        var code = error && error.code;
        var mapped = {
          RATE_LIMITED: 'vatra_error_rate_limited',
          PAIRING_ATTEMPTS_EXCEEDED: 'vatra_limit_hit_pair_complete',
          PAIRING_NOT_FOUND: 'vatra_error_pairing_not_found',
          PAIRING_EXPIRED: 'vatra_error_pairing_expired'
        };
        if (code && mapped[code]) return VC.L.Lang.translate(mapped[code]);
        if (error && error.message) return error.message;
        return fallbackKey ? VC.L.Lang.translate(fallbackKey) : VC.L.Lang.translate('vatra_error_generic');
      };
      VC.refreshToken = function () {
        var refreshToken = VC.L.Storage.get(VC.KEY.refresh, '');
        if (!refreshToken) return Promise.reject(new Error('NO_REFRESH_TOKEN'));
        return fetch(VC.apiBase() + '/auth/refresh', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: refreshToken
          }),
          cache: 'no-store'
        }).then(function (resp) {
          return resp.text().then(function (text) {
            var data = {};
            try {
              data = text ? JSON.parse(text) : {};
            } catch (e) {}
            if (!resp.ok || !data.tokens || !data.tokens.accessToken) throw new Error(data.code || 'REFRESH_FAILED');
            VC.L.Storage.set(VC.KEY.token, data.tokens.accessToken || '');
            VC.L.Storage.set(VC.KEY.refresh, data.tokens.refreshToken || refreshToken);
            return data.tokens.accessToken;
          });
        });
      };
      VC.req = function (path) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var headers = opts.headers || {};
        headers['content-type'] = headers['content-type'] || 'application/json';
        if (VC.token()) {
          headers.token = VC.token();
          headers.authorization = 'Bearer ' + VC.token();
        }
        if (VC.profile()) headers.profile = VC.profile();
        var deviceId = VC.L.Storage.get(VC.KEY.deviceId, '');
        var deviceKeyId = VC.L.Storage.get(VC.KEY.keyId, '');
        if (deviceId) headers['x-device-id'] = deviceId;
        if (deviceKeyId) headers['x-device-key-id'] = deviceKeyId;
        var request = function request() {
          VC.trackRateLimitProgress(path);
          return fetch(VC.apiBase() + path, {
            method: opts.method || 'GET',
            headers: headers,
            body: opts.body ? JSON.stringify(opts.body) : undefined,
            cache: 'no-store'
          }).then(function (resp) {
            return resp.text().then(function (text) {
              var data = {};
              try {
                data = text ? JSON.parse(text) : {};
              } catch (e) {}
              if (!resp.ok) {
                var err = new Error(data.code || text || 'HTTP ' + resp.status);
                err.status = resp.status;
                err.code = data.code;
                err.path = path;
                err.payload = data;
                throw err;
              }
              return data;
            });
          });
        };
        return request()["catch"](function (error) {
          if (error && error.status === 429) {
            VC.notifyRateLimited(path, error.code);
          }
          if (error.status !== 401 || opts.skipRefresh) throw error;
          return VC.refreshToken().then(function (newAccessToken) {
            headers.token = newAccessToken;
            headers.authorization = 'Bearer ' + newAccessToken;
            return request();
          })["catch"](function (refreshError) {
            VC.disconnect();
            throw refreshError;
          });
        });
      };
    }

    function initPairing(VC) {
      VC._pairCompleteAttempts = VC._pairCompleteAttempts || {};
      var notePairCompleteAttempt = function notePairCompleteAttempt(code) {
        VC._pairCompleteAttempts[code] = (VC._pairCompleteAttempts[code] || 0) + 1;
        return VC._pairCompleteAttempts[code];
      };
      VC.completePair = function () {
        var code = VC.L.Storage.get(VC.KEY.pairingCode, '');
        if (!code) {
          VC.notify(VC.L.Lang.translate('vatra_no_pending_pair'));
          return;
        }

        // Check pairing code age — reject if older than 5 minutes
        var pairTs = VC.L.Storage.get(VC.KEY.pairTs, 0);
        var now = Date.now();
        var ageMs = now - (typeof pairTs === 'number' ? pairTs : 0);
        var maxAgeMs = 5 * 60 * 1000;
        if (ageMs > maxAgeMs) {
          VC.notify(VC.L.Lang.translate('vatra_pair_expired'));
          VC.L.Storage.set(VC.KEY.pairingCode, '');
          VC.L.Storage.set(VC.KEY.pairTs, 0);
          return;
        }
        var attempts = notePairCompleteAttempt(code);
        if (attempts >= 4) {
          var remaining = Math.max(5 - attempts, 0);
          VC.bell(VC.L.Lang.translate('vatra_limit_soon_pair_complete', {
            remaining: remaining
          }));
        }
        VC.req('/connector/v1/pair/complete', {
          method: 'POST',
          body: {
            code: code,
            keyId: VC.keyId(),
            clientPubKey: VC.publicKey(),
            fingerprint: {
              platform: VC.Device.getInfo().platform,
              appVersion: VC.Device.getInfo().appVersion,
              osVersion: VC.Device.getInfo().osVersion,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
              locale: VC.L.Storage.get('language', 'ru') || 'ru'
            }
          }
        }).then(function (data) {
          if (data.decision && data.decision !== 'ALLOW') {
            VC.notify(VC.L.Lang.translate('vatra_pair_status', {
              status: data.decision
            }));
            return;
          }
          if (data.session && data.session.accessToken) {
            VC.saveSession(data.session);
            delete VC._pairCompleteAttempts[code];
            VC.notify(VC.L.Lang.translate('vatra_connected'));
            return;
          }
          VC.notify(VC.L.Lang.translate('vatra_pair_failed_no_session'));
        })["catch"](function (e) {
          VC.notify(VC.apiErrorText(e, 'vatra_pair_failed'));
        });
      };
      VC.startPair = function () {
        var nonceBytes = new Uint8Array(16);
        crypto.getRandomValues(nonceBytes);
        var clientNonce = Array.from(nonceBytes).map(function (b) {
          return b.toString(36).slice(0, 2);
        }).join('').slice(0, 32);
        VC.req('/connector/v1/pair/start', {
          method: 'POST',
          body: {
            deviceName: VC.L.Storage.get('device_name', 'Lampa Device'),
            platform: VC.Device.getPlatform(),
            appVersion: VC.Device.getAppVersion() || VC.L.Manifest.app_version || 'unknown',
            deviceUid: VC.deviceUid(),
            clientNonce: clientNonce
          }
        }).then(function (data) {
          var code = data.pairing ? data.pairing.code : '';
          if (!code) {
            VC.notify(VC.L.Lang.translate('vatra_pair_start_failed_no_code'));
            return;
          }
          VC.L.Storage.set(VC.KEY.pairingCode, code);
          VC.L.Storage.set(VC.KEY.pairTs, Date.now());
          VC._pairCompleteAttempts[code] = 0;
          VC.L.Select.show({
            title: VC.L.Lang.translate('vatra_pairing_title'),
            items: [{
              title: 'Code: ' + code,
              nosel: true
            }, {
              title: VC.L.Lang.translate('vatra_pair_approve_info'),
              complete: true,
              selected: true
            }, {
              title: VC.L.Lang.translate('cancel')
            }],
            onSelect: function onSelect(sel) {
              if (sel.complete) VC.completePair();
            },
            onBack: function onBack() {
              VC.L.Controller.toggle('settings_component');
            }
          });
        })["catch"](function (e) {
          VC.notify(VC.apiErrorText(e, 'vatra_pair_start_failed'));
        });
      };
    }

    function initProfiles(VC) {
      var DEFAULT_PROFILE_ICON_SVG = '<svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18.5" cy="12" r="6" stroke="white" stroke-width="3"/><path d="M8 30C8.9 24.3 13.3 21 18.5 21C23.7 21 28.1 24.3 29 30" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>';
      VC.defaultProfileIconSvg = function () {
        return DEFAULT_PROFILE_ICON_SVG;
      };
      VC.normalizeProfileAvatar = function (avatar) {
        if (typeof avatar !== 'string') return '';
        var svg = avatar.trim();
        if (!svg) return '';
        if (!/^<svg[\s>]/i.test(svg)) return '';
        if (/<script[\s>]/i.test(svg)) return '';
        return svg;
      };
      VC.profileAvatarHtml = function (profile) {
        if (!profile) return VC.defaultProfileIconSvg();
        return VC.normalizeProfileAvatar(profile.avatar) || VC.defaultProfileIconSvg();
      };
      VC.profileAvatarDataUri = function (profile) {
        var svg = VC.profileAvatarHtml(profile);
        if (!svg || !/^<svg[\s>]/i.test(svg)) return '';
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      };
      VC.profileAvatarIconMarkup = function (profile) {
        var dataUri = VC.profileAvatarDataUri(profile);
        if (!dataUri) return VC.defaultProfileIconSvg();
        return '<img class="vatra-profile-avatar" src="' + dataUri + '" alt="" />';
      };
      VC.normalizeProfiles = function (data) {
        var items = data && (data.items || data.profiles) || [];
        return items.map(function (profile) {
          var id = String(profile.id || '');
          var name = String(profile.name || '');
          var isDefault = !!(profile.is_default || profile.main);
          var slug = String(profile.slug || '');
          return {
            id: id,
            name: name,
            slug: slug,
            avatar: profile.avatar || '',
            isDefault: isDefault
          };
        }).filter(function (profile) {
          return profile.id;
        });
      };
      VC.getProfiles = function () {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$force = _ref.force,
          force = _ref$force === void 0 ? false : _ref$force;
        var now = Date.now();
        if (!force && VC._profilesCache && VC._profilesCache.length && now - (VC._profilesCacheAt || 0) < 60000) {
          return Promise.resolve(VC._profilesCache);
        }
        if (!force && VC._profilesRequest) return VC._profilesRequest;
        VC._profilesRequest = VC.req('/connector/v1/profiles').then(function (data) {
          var profiles = VC.normalizeProfiles(data);
          VC._profilesCache = profiles;
          VC._profilesCacheAt = Date.now();
          return profiles;
        })["finally"](function () {
          VC._profilesRequest = null;
        });
        return VC._profilesRequest;
      };
      VC.getActiveProfile = function (profiles) {
        var list = profiles || VC._profilesCache || [];
        var currentId = String(VC.profile() || '');
        if (currentId) {
          var active = list.find(function (profile) {
            return profile.id === currentId;
          });
          if (active) return active;
        }
        var defaultProfile = list.find(function (profile) {
          return profile.isDefault;
        });
        if (defaultProfile) return defaultProfile;
        return list[0] || null;
      };
      VC.showProfiles = function (backTarget) {
        VC.getProfiles({
          force: true
        }).then(function (profiles) {
          var activeProfile = VC.getActiveProfile(profiles);
          var items = profiles.map(function (profile) {
            return {
              title: profile.name + (profile.isDefault ? ' (default)' : ''),
              profileId: profile.id,
              profileName: profile.name,
              profileSlug: profile.slug,
              template: 'selectbox_icon',
              icon: VC.profileAvatarIconMarkup(profile),
              selected: activeProfile ? activeProfile.id === profile.id : false
            };
          });
          items.push({
            title: VC.L.Lang.translate('cancel')
          });
          VC.L.Select.show({
            title: VC.L.Lang.translate('vatra_profiles_title'),
            items: items,
            onSelect: function onSelect(sel) {
              if (!sel.profileId) return;
              var previousProfileId = VC.storageProfileId(VC.KEY.profileId);
              var previousProfilePin = VC.storageProfileId(VC.KEY.profilePin);
              var nextProfileId = VC.normalizeProfileId(sel.profileId);
              var nextProfileSlug = String(sel.profileSlug || '');
              if (!nextProfileId) return;
              if (VC.profile()) VC.saveCurrentProfileLocalState(VC.profile());
              VC.L.Storage.set(VC.KEY.profileId, nextProfileId);
              VC.L.Storage.set(VC.KEY.profilePin, nextProfileId);
              VC.applyProfileLocalState(nextProfileId);
              if (VC.syncHeaderProfileButton) VC.syncHeaderProfileButton();
              VC.req('/connector/v1/profiles/select', {
                method: 'POST',
                body: {
                  profileId: nextProfileId,
                  id: nextProfileId,
                  profile: nextProfileId,
                  slug: nextProfileSlug || undefined
                }
              }).then(function (response) {
                var serverProfileId = VC.normalizeProfileId(response && (response.profileId || response.profile || response.item)) || nextProfileId;
                if (serverProfileId) {
                  VC.L.Storage.set(VC.KEY.profileId, serverProfileId);
                  VC.L.Storage.set(VC.KEY.profilePin, serverProfileId);
                }
                var selectedProfile = profiles.find(function (profile) {
                  return profile.id === String(sel.profileId);
                });
                if (selectedProfile) {
                  VC._profilesCache = profiles;
                  VC._profilesCacheAt = Date.now();
                }
                VC.saveCurrentProfileLocalState(VC.profile());
                VC.refreshProfileRuntimeState();
                if (VC.L.Listener && VC.L.Listener.send) {
                  VC.L.Listener.send('profile_select', {
                    profile: {
                      id: VC.profile(),
                      name: sel.profileName || sel.title
                    }
                  });
                }
                if (VC.syncHeaderProfileButton) VC.syncHeaderProfileButton();
                VC.notify(VC.L.Lang.translate('vatra_profile_switched'));
                VC.reloadAppSoon(VC.L.Lang.translate('vatra_profile_changed'));
              })["catch"](function (e) {
                VC.L.Storage.set(VC.KEY.profileId, previousProfileId || '');
                VC.L.Storage.set(VC.KEY.profilePin, previousProfilePin || '');
                if (VC.profile()) VC.applyProfileLocalState(VC.profile());
                if (VC.syncHeaderProfileButton) VC.syncHeaderProfileButton();
                VC.notify(e.message || VC.L.Lang.translate('vatra_profile_switch_failed'));
              });
            },
            onBack: function onBack() {
              VC.L.Controller.toggle(backTarget || 'settings_component');
            }
          });
        })["catch"](function (e) {
          VC.notify(e.message || VC.L.Lang.translate('vatra_profiles_load_failed'));
        });
      };
    }

    function initBackup(VC) {
      VC.BACKUP_PROTECTED_KEYS = [VC.KEY.token, VC.KEY.refresh, VC.KEY.deviceId, VC.KEY.keyId, VC.KEY.profileId, VC.KEY.profilePin, VC.KEY.pairingCode, VC.KEY.pairTs, VC.KEY.uid, VC.KEY.pub];
      VC.isBackupProtectedKey = function (key) {
        return VC.BACKUP_PROTECTED_KEYS.indexOf(key) !== -1;
      };
      VC.importBackupItem = function (key, value) {
        if (VC.isBackupProtectedKey(key)) return false;
        if (key === 'plugins') {
          var plugins = VC.mergeProtectedPlugins ? VC.mergeProtectedPlugins(VC.parsePluginBackupValue(value)) : value;
          VC.L.Storage.set('plugins', plugins, true);
          return true;
        }
        localStorage.setItem(key, value);
        return true;
      };
      VC.backupExport = function () {
        VC.ensureCubSafe(VC.L.Lang.translate('vatra_backup_export'), function () {
          var payload = {};
          Object.keys(localStorage).forEach(function (key) {
            if (VC.isBackupProtectedKey(key)) return;
            payload[key] = localStorage.getItem(key);
          });
          VC.req('/connector/v1/backup/export', {
            method: 'POST',
            body: {
              data: payload,
              meta: {
                source: 'lampa-plugin',
                appVersion: VC.L.Manifest.app_version || 'unknown'
              }
            }
          }).then(function () {
            VC.notify(VC.L.Lang.translate('vatra_backup_exported'));
          })["catch"](function (e) {
            VC.notify(e.message || VC.L.Lang.translate('vatra_backup_export_failed'));
          });
        });
      };
      VC.backupImport = function () {
        VC.ensureCubSafe(VC.L.Lang.translate('vatra_backup_import'), function () {
          VC.req('/connector/v1/backup/import').then(function (data) {
            var items = data.data || {};
            var imported = 0;
            Object.keys(items).forEach(function (key) {
              if (VC.importBackupItem(key, items[key])) imported += 1;
            });
            VC.notify(VC.L.Lang.translate('vatra_backup_imported_count', {
              count: imported
            }));
            VC.reloadAppSoon(VC.L.Lang.translate('vatra_backup_imported'));
          })["catch"](function (e) {
            VC.notify(e.message || VC.L.Lang.translate('vatra_backup_import_failed'));
          });
        });
      };
    }

    function initPlugins(VC) {
      VC.PROTECTED_PLUGIN_URLS = ['https://lme-vatra.github.io/c.js'];
      VC.normalizePluginUrl = function (url) {
        return String(url || '').trim();
      };
      VC.pluginsSignature = function (list) {
        return VC.normalizePlugins(list).map(function (plugin) {
          return [plugin.url, plugin.status ? 1 : 0, plugin.name || plugin.url].join('|');
        }).sort().join('\n');
      };
      VC.collectProtectedPlugins = function () {
        var protectedMap = {};
        var localList = VC.normalizePlugins(VC.L.Storage.get('plugins', '[]'));
        VC.PROTECTED_PLUGIN_URLS.forEach(function (url) {
          var normalizedUrl = VC.normalizePluginUrl(url);
          if (!normalizedUrl) return;
          protectedMap[normalizedUrl] = {
            url: normalizedUrl,
            status: 1,
            name: normalizedUrl
          };
        });
        localList.forEach(function (plugin) {
          var url = VC.normalizePluginUrl(plugin.url);
          if (!url) return;
          if (VC.PROTECTED_PLUGIN_URLS.indexOf(url) !== -1) protectedMap[url] = plugin;
        });
        return protectedMap;
      };
      VC.mergeProtectedPlugins = function (list) {
        var map = {};
        VC.normalizePlugins(list).forEach(function (plugin) {
          return map[plugin.url] = plugin;
        });
        var protectedMap = VC.collectProtectedPlugins();
        Object.keys(protectedMap).forEach(function (url) {
          return map[url] = protectedMap[url];
        });
        return Object.keys(map).map(function (key) {
          return map[key];
        });
      };
      VC.parsePluginBackupValue = function (value) {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
          try {
            var parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            return [];
          }
        }
        return [];
      };
      VC.normalizePlugins = function (list) {
        var source = Array.isArray(list) ? list : [];
        return source.map(function (plugin) {
          if (typeof plugin === 'string') {
            var _url = VC.normalizePluginUrl(plugin);
            if (!_url) return null;
            return {
              url: _url,
              status: 1,
              name: _url
            };
          }
          var url = VC.normalizePluginUrl(plugin && plugin.url);
          if (!url) return null;
          return {
            url: url,
            status: plugin.status ? 1 : 0,
            name: plugin.name || url
          };
        }).filter(function (plugin) {
          return plugin && plugin.url;
        });
      };
      VC.pushPluginsToCloud = function (list) {
        var normalized = VC.mergeProtectedPlugins(list);
        return VC.req('/connector/v1/plugins/sync', {
          method: 'POST',
          body: {
            plugins: normalized
          }
        });
      };
      VC.setPluginsIfChanged = function (plugins) {
        var local = VC.normalizePlugins(VC.L.Storage.get('plugins', '[]'));
        var merged = VC.mergeProtectedPlugins([].concat(local, plugins));
        if (VC.pluginsSignature(local) === VC.pluginsSignature(merged)) {
          return {
            changed: false,
            plugins: merged
          };
        }
        VC._skipPluginPushOnce = true;
        VC.L.Storage.set('plugins', merged);
        return {
          changed: true,
          plugins: merged
        };
      };
      VC.pullCloudPluginsToStorage = function () {
        return VC.req('/connector/v1/plugins').then(function (data) {
          var cloud = VC.normalizePlugins(data.plugins || []);
          var result = VC.setPluginsIfChanged(cloud);
          return result.plugins;
        });
      };
      VC.syncPlugins = function () {
        VC.ensureCubSafe(VC.L.Lang.translate('vatra_sync_plugins'), function () {
          VC.pullCloudPluginsToStorage().then(function (merged) {
            VC.pushPluginsToCloud(merged).then(function () {
              VC.notify(VC.L.Lang.translate('vatra_plugins_synced_dot'));
              VC.reloadAppSoon(VC.L.Lang.translate('vatra_plugins_synced'));
            })["catch"](function (e) {
              VC.notify(e.message || VC.L.Lang.translate('vatra_plugin_sync_failed'));
            });
          })["catch"](function (e) {
            VC.notify(e.message || VC.L.Lang.translate('vatra_cloud_plugins_failed'));
          });
        });
      };
    }

    function initSettings(VC) {
      VC.renderStatusLabel = function () {
        var lang = VC.L.Lang;
        var status = VC.token() ? lang.translate('vatra_status_connected') : lang.translate('vatra_status_not_connected');
        var profile = VC.profile() || '';
        return 'Vatra: ' + status + (profile ? ' | ' + profile : '');
      };
      VC.addSettingsSection = function () {
        if (!VC.L.SettingsApi || !VC.L.SettingsApi.addComponent) return;
        var lang = VC.L.Lang;
        VC.L.SettingsApi.addComponent({
          component: VC.COMPONENT,
          name: 'Vatra',
          icon: '<svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="33" height="33" rx="6" stroke="white" stroke-width="3"/><path d="M11 13L18.5 25L26 13" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          after: 'account'
        });
        VC.L.SettingsApi.addParam({
          component: VC.COMPONENT,
          param: {
            type: 'button'
          },
          field: {
            name: VC.renderStatusLabel()
          },
          onChange: function onChange() {
            return VC.notify(VC.renderStatusLabel());
          }
        });
        VC.L.SettingsApi.addParam({
          component: VC.COMPONENT,
          param: {
            type: 'title'
          },
          field: {
            name: lang.translate('vatra_connection')
          }
        });
        VC.L.SettingsApi.addParam({
          component: VC.COMPONENT,
          param: {
            type: 'button'
          },
          field: {
            name: VC.token() ? lang.translate('vatra_reconnect_device') : lang.translate('vatra_connect_device')
          },
          onChange: VC.startPair
        });
        VC.L.SettingsApi.addParam({
          component: VC.COMPONENT,
          param: {
            type: 'button'
          },
          field: {
            name: lang.translate('vatra_complete_pending_pair')
          },
          onChange: VC.completePair
        });
        VC.L.SettingsApi.addParam({
          component: VC.COMPONENT,
          param: {
            type: 'title'
          },
          field: {
            name: lang.translate('vatra_data')
          }
        });
        VC.L.SettingsApi.addParam({
          component: VC.COMPONENT,
          param: {
            type: 'button'
          },
          field: {
            name: lang.translate('vatra_switch_profile')
          },
          onChange: function onChange() {
            return VC.showProfiles('settings_component');
          }
        });
        VC.L.SettingsApi.addParam({
          component: VC.COMPONENT,
          param: {
            type: 'button'
          },
          field: {
            name: lang.translate('vatra_backup_export')
          },
          onChange: VC.backupExport
        });
        VC.L.SettingsApi.addParam({
          component: VC.COMPONENT,
          param: {
            type: 'button'
          },
          field: {
            name: lang.translate('vatra_backup_import')
          },
          onChange: VC.backupImport
        });
        VC.L.SettingsApi.addParam({
          component: VC.COMPONENT,
          param: {
            type: 'button'
          },
          field: {
            name: lang.translate('vatra_sync_plugins')
          },
          onChange: VC.syncPlugins
        });
        VC.L.SettingsApi.addParam({
          component: VC.COMPONENT,
          param: {
            type: 'button'
          },
          field: {
            name: lang.translate('vatra_disconnect')
          },
          onChange: VC.disconnect
        });
        VC.L.Settings.listener.follow('open', function (e) {
          if (e.name !== VC.COMPONENT) return;
          if (VC.cubSyncEnabled()) VC.notify(lang.translate('vatra_cub_sync_enabled'));
        });
      };
    }

    function initHeader(VC) {
      VC.renderProfileButtonIcon = function (button, profile) {
        if (!button || !button.length) return;
        button.empty();
        if (VC.profileAvatarIconMarkup) button.append(VC.profileAvatarIconMarkup(profile));else if (VC.L.Template && VC.L.Template.js) button.append(VC.L.Template.js('icon_profile'));else button.append(VC.defaultProfileIconSvg ? VC.defaultProfileIconSvg() : '');
      };
      VC.createProfileButton = function () {
        var button = null;
        if (VC.L.Template && VC.L.Template.elem && VC.L.Template.js) {
          button = VC.L.Template.elem('div', {
            "class": 'head__action selector open--profile vatra-managed'
          });
        } else {
          button = $('<div class="head__action selector open--profile vatra-managed"></div>');
        }
        VC.renderProfileButtonIcon(button, null);
        button.on('hover:enter', function () {
          return VC.showProfiles('head');
        });
        return button;
      };
      VC.syncProfileButtonAvatar = function () {
        var button = $('.head .open--profile.vatra-managed').first();
        if (!button.length) return;
        if (!VC.getProfiles || !VC.getActiveProfile) {
          VC.renderProfileButtonIcon(button, null);
          return;
        }
        VC.getProfiles().then(function (profiles) {
          VC.renderProfileButtonIcon(button, VC.getActiveProfile(profiles));
        })["catch"](function () {
          VC.renderProfileButtonIcon(button, VC.getActiveProfile());
        });
      };
      VC.syncHeaderProfileButton = function () {
        var connected = !!VC.token();
        if (!connected) {
          $('.head .open--profile.vatra-managed').remove();
          $('.head .open--profile.vatra-hidden-by-vatra').removeClass('hide vatra-hidden-by-vatra');
          return;
        }
        $('.head .open--profile').not('.vatra-managed').addClass('hide vatra-hidden-by-vatra');
        var button = $('.head .open--profile.vatra-managed').first();
        if (!button.length) {
          var head = VC.L.Head && VC.L.Head.render ? VC.L.Head.render() : $('.head');
          var fullScreen = head.find('.full--screen');
          button = VC.createProfileButton();
          if (fullScreen.length) fullScreen.before(button);else head.find('.head__actions').append(button);
        }
        VC.syncProfileButtonAvatar();
      };
      VC.bindHeaderIntegration = function () {
        VC.syncHeaderProfileButton();
        if (VC.L.Storage && VC.L.Storage.listener) {
          VC.L.Storage.listener.follow('change', function (e) {
            if (!e) return;
            if (e.name === 'account_use' || e.name === 'account_sync' || e.name === VC.KEY.token || e.name === VC.KEY.profileId || e.name === VC.KEY.profilePin) {
              VC.syncHeaderProfileButton();
            }
          });
        }
        if (VC.L.Listener && VC.L.Listener.follow) {
          VC.L.Listener.follow('profile_select', function () {
            VC.syncProfileButtonAvatar();
          });
        }
      };
    }

    function initStateSync(VC) {
      // === PATCH TMDB.img: fix double-slash bug =========================
      // Original Lampa code: baseimg = 't/p/'+poster_size+'/' → src starts with '/'
      // Result: image.tmdb.org/t/p/w300//poster.jpg (broken)
      // We patch to ensure exactly one slash between size and poster_path.
      if (VC.L && VC.L.TMDB && VC.L.TMDB.img) {
        VC.L.TMDB.img;
        VC.L.TMDB.img = function (src, size) {
          if (!src) return '';
          var posterSize = VC.L.Storage.field('poster_size') || 'w300';
          var path = 't/p/' + posterSize;
          if (size) path = path.replace(new RegExp(posterSize, 'g'), size);
          // Ensure single slash: strip leading slash from src
          var cleanSrc = src.charAt(0) === '/' ? src.substring(1) : src;
          return VC.L.TMDB.image(path + '/' + cleanSrc);
        };
      }
      // Also patch Lampa.Api.img which delegates to TMDB.img
      if (VC.L && VC.L.Api && VC.L.Api.img) {
        VC.L.Api.img = function (src, size) {
          return VC.L.TMDB.img(src, size);
        };
      }
      // ==================================================================

      // NOTE: Bucket-to-Lampa mappings removed — Lampa uses its own internal category system.
      // We now rely on Lampa APIs directly instead of maintaining parallel mapping tables.

      // NOTE: mediaTypeFromCard, contentKeyFromCard, cardFromContentKey removed.
      // Lampa's native APIs use their own content key format; no conversion needed.

      // NOTE: fixCardImg removed — no longer needed after applyCloudBookmarks removal.
      // TMDB img patch above (lines 6-23) is still active and sufficient.

      // NOTE: applyCloudBookmarks and applyCloudProgress removed.
      // Lampa's Account.Bookmarks and Timeline modules handle cloud sync natively.

      VC.loadCloudState = function () {
        if (!VC.token() || !VC.profile()) return Promise.resolve();

        // Delegate to Lampa's native cloud sync.
        // Account.Bookmarks.update() loads dump/changelog from cloud and updates Favorite state.
        // Timeline state is automatically handled by Account.Timeline (initialized alongside Bookmarks).
        if (Lampa && Lampa.Account && Lampa.Account.Bookmarks && Lampa.Account.Bookmarks.update) {
          return Lampa.Account.Bookmarks.update();
        }
        return Promise.resolve();
      };
      VC.scheduleStateSync = function (key, fn, delay) {
        var ms = typeof delay === 'number' ? delay : 700;
        clearTimeout(VC._stateSyncTimers[key]);
        VC._stateSyncTimers[key] = setTimeout(fn, ms);
      };
      VC.syncTimelineState = function (data) {
        if (!VC.token()) return;
        var profileId = VC.profile();
        if (!profileId) return;
        if (!data || !data.hash || !data.road) return;
        var hash = String(data.hash);
        var road = data.road || {};
        var percent = Math.max(0, Math.min(100, Number(road.percent || 0)));
        var time = Math.max(0, Math.round(Number(road.time || 0)));
        var duration = Math.max(1, Math.round(Number(road.duration || 1)));
        var contentKey = 'timeline:' + hash;
        var deviceId = VC.L.Storage.get(VC.KEY.deviceId, '') || null;
        VC.scheduleStateSync('timeline:' + hash, function () {
          VC.req('/state/progress', {
            method: 'PUT',
            body: {
              profileId: profileId,
              contentKey: contentKey,
              positionSeconds: time,
              durationSeconds: duration,
              progressPercent: percent,
              sourceDeviceId: deviceId,
              sourceSessionId: null
            }
          })["catch"](function () {});
          if (percent > 0 && percent < 98) {
            VC.req('/state/continue-watching', {
              method: 'PUT',
              body: {
                profileId: profileId,
                contentKey: contentKey,
                titleCached: null,
                posterCached: null,
                lastPositionSeconds: time,
                sourceDeviceId: deviceId
              }
            })["catch"](function () {});
          }
        });
      };

      // NOTE: syncFavoriteState removed — Lampa.Account.Bookmarks already listens to
      // Favorite.add/remove events and pushes changes to cloud via VC.req internally.

      VC.bindStateSync = function () {
        if (!VC.L.Listener || !VC.L.Listener.follow) return;

        // On profile change, trigger Lampa's native cloud sync for bookmarks & timeline
        VC.L.Listener.follow('profile_select', function () {
          if (VC.profile()) {
            // Lampa's Account.Bookmarks.update() will fetch cloud bookmarks
            if (Lampa && Lampa.Account && Lampa.Account.Bookmarks && Lampa.Account.Bookmarks.update) {
              Lampa.Account.Bookmarks.update();
            }
            VC.connectStateRealtime();
          }
        });

        // Only timeline events need VC-specific cloud sync (progress/continue-watching).
        // Favorite/bookmark changes are handled natively by Lampa → Account.Bookmarks.push()
        VC.L.Listener.follow('state:changed', function (event) {
          if (!event) return;
          if (event.target === 'timeline' && event.reason === 'update' && event.data) {
            VC.syncTimelineState(event.data);
            return;
          }

          // Favorite events are handled by Lampa natively; no action needed here
        });

        // Initial cloud load (delegates to Lampa)
        VC.loadCloudState()["catch"](function () {});
        VC.connectStateRealtime();
      };
      VC.connectStateRealtime = function () {
        if (!VC.token() || VC._stateRealtimeConnecting) return;
        if (VC._stateRealtime && VC._stateRealtime.readyState <= 1) return;
        if (typeof WebSocket === 'undefined') return;
        var base = VC.apiBase().replace(/^http/, 'ws');
        VC._stateRealtimeConnecting = true;
        VC._stateRealtime = new WebSocket(base + '/state/realtime?token=' + encodeURIComponent(VC.token()));
        VC._stateRealtime.onopen = function () {
          VC._stateRealtimeConnecting = false;
        };
        VC._stateRealtime.onmessage = function (event) {
          var message = {};
          try {
            message = JSON.parse(event.data || '{}');
          } catch (e) {}
          if (message.method !== 'state' || !message.data) return;
          if (message.data.profileId && message.data.profileId !== VC.profile()) return;
          VC.loadCloudState()["catch"](function () {});
        };
        VC._stateRealtime.onclose = function () {
          VC._stateRealtimeConnecting = false;
          VC._stateRealtime = null;
          setTimeout(function () {
            return VC.connectStateRealtime();
          }, 5000);
        };
        VC._stateRealtime.onerror = function () {
          VC._stateRealtimeConnecting = false;
        };
      };
    }

    function initMain(VC) {
      VC.AUTO_PUSH_PLUGINS = true;
      VC.AUTO_PULL_PLUGINS = true;
      VC.PLUGIN_SYNC_POLL_MS = 60000;
      VC.removeLegacyMenuButton = function () {
        $('.menu .menu__list:eq(0) .menu__item').each(function () {
          var text = $(this).find('.menu__text').text().trim();
          if (text === 'Vatra') $(this).remove();
        });
      };
      VC.bindProfileAndPlugins = function () {
        var syncTimer = 0;
        var pullTimer = 0;
        var pullBusy = false;
        var pullPlugins = function pullPlugins() {
          if (!VC.AUTO_PULL_PLUGINS) return;
          if (!VC.token() || !VC.profile()) return;
          if (pullBusy) return;
          var before = VC.pluginsSignature(VC.L.Storage.get('plugins', '[]'));
          pullBusy = true;
          VC.pullCloudPluginsToStorage().then(function (plugins) {
            var after = VC.pluginsSignature(plugins);
            if (before !== after) {
              VC.reloadAppSoon(VC.L.Lang.translate('vatra_plugins_synced'));
            }
          })["catch"](function () {})["finally"](function () {
            pullBusy = false;
          });
        };
        var schedulePluginPolling = function schedulePluginPolling() {
          clearInterval(pullTimer);
          if (!VC.AUTO_PULL_PLUGINS || !VC.token() || !VC.profile()) return;
          pullTimer = setInterval(function () {
            pullPlugins();
          }, VC.PLUGIN_SYNC_POLL_MS);
        };
        if (VC.profile()) {
          VC.applyProfileLocalState(VC.profile());
          VC.refreshProfileRuntimeState();
          setTimeout(function () {
            pullPlugins();
            schedulePluginPolling();
          }, 1500);
        }
        if (VC.L.Listener && VC.L.Listener.follow) {
          VC.L.Listener.follow('profile_select', function () {
            if (VC.profile()) {
              VC.applyProfileLocalState(VC.profile());
              VC.refreshProfileRuntimeState();
              pullPlugins();
              schedulePluginPolling();
            }
          });
        }
        if (VC.L.Storage && VC.L.Storage.listener) {
          VC.L.Storage.listener.follow('change', function (e) {
            if (!e || e.name !== 'plugins') return;
            if (!VC.token()) return;
            if (!VC.AUTO_PUSH_PLUGINS) return;
            if (VC._skipPluginPushOnce) {
              VC._skipPluginPushOnce = false;
              return;
            }
            clearTimeout(syncTimer);
            syncTimer = setTimeout(function () {
              var localPlugins = VC.mergeProtectedPlugins(VC.L.Storage.get('plugins', '[]'));
              VC.pushPluginsToCloud(localPlugins).then(function () {
                VC.notify(VC.L.Lang.translate('vatra_plugins_synced_dot'));
              })["catch"](function (error) {
                VC.notify(error.message || VC.L.Lang.translate('vatra_plugin_sync_failed'));
              });
            }, 400);
          });
        }
      };
      VC.init = function () {
        VC.removeLegacyMenuButton();
        VC.addSettingsSection();
        VC.bindHeaderIntegration();
        VC.bindProfileAndPlugins();
        VC.bindStateSync();
      };
      if (window.appready) VC.init();else {
        VC.L.Listener.follow('app', function (e) {
          if (e.type === 'ready') VC.init();
        });
      }
    }

    function startPlugin() {
      if (window.plugin_vatra_connector_ready) return;
      var VC = createConnector();
      if (!VC) return;
      window.plugin_vatra_connector_ready = true;
      initLang(VC);
      initHelpers(VC);
      initState(VC);
      initDevice(VC);
      initProfileState(VC);
      initApi(VC);
      initPairing(VC);
      initProfiles(VC);
      initBackup(VC);
      initPlugins(VC);
      initSettings(VC);
      initHeader(VC);
      initStateSync(VC);
      initMain(VC);
    }
    if (!window.plugin_vatra_connector_ready) startPlugin();

})();
