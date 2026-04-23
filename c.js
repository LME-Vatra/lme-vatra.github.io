(function () {
    'use strict';

    function createConnector() {
      if (window.vatra_connector_ready) return null;
      window.vatra_connector_ready = true;
      var VC = {
        version: '0.0.3',
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

    function initState(VC) {
      VC.apiBase = function () {
        return 'https://be.vatra.ovh';
      };
      VC.token = function () {
        return VC.L.Storage.get(VC.KEY.token, '');
      };
      VC.profile = function () {
        return VC.L.Storage.get(VC.KEY.profileId, '');
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
        VC.L.Storage.set(VC.KEY.token, session.accessToken || '');
        VC.L.Storage.set(VC.KEY.refresh, session.refreshToken || '');
        VC.L.Storage.set(VC.KEY.deviceId, session.deviceId || '');
        VC.L.Storage.set(VC.KEY.keyId, session.keyId || VC.keyId());
        VC.L.Storage.set(VC.KEY.profileId, session.profileId || '');
        VC.L.Storage.set(VC.KEY.pairingCode, '');
      };
      VC.disconnect = function () {
        VC.L.Storage.set(VC.KEY.token, '');
        VC.L.Storage.set(VC.KEY.refresh, '');
        VC.L.Storage.set(VC.KEY.deviceId, '');
        VC.L.Storage.set(VC.KEY.profileId, '');
        VC.L.Storage.set(VC.KEY.pairingCode, '');
        VC.notify(VC.L.Lang.translate('vatra_disconnected_from'));
      };
    }

    function initProfileState(VC) {
      VC.PROFILE_STATE_KEYS = ['favorite', 'file_view', 'recomends_scan', 'recomends_list', 'timetable', 'account_bookmarks'];
      VC.profileStateStorageKey = function (profileId) {
        return 'vatra_profile_state_' + String(profileId || 'default');
      };
      VC.readProfileStateSnapshot = function (profileId) {
        return VC.L.Storage.get(VC.profileStateStorageKey(profileId), '{}');
      };
      VC.saveCurrentProfileLocalState = function (profileId) {
        if (!profileId) return;
        var snapshot = {};
        VC.PROFILE_STATE_KEYS.forEach(function (key) {
          snapshot[key] = VC.L.Storage.get(key, null);
        });
        VC.L.Storage.set(VC.profileStateStorageKey(profileId), snapshot);
      };
      VC.applyProfileLocalState = function (profileId) {
        if (!profileId) return;
        var snapshot = VC.readProfileStateSnapshot(profileId);
        VC.PROFILE_STATE_KEYS.forEach(function (key) {
          if (Object.prototype.hasOwnProperty.call(snapshot, key)) VC.L.Storage.set(key, snapshot[key], true);else if (key === 'favorite') VC.L.Storage.set(key, {}, true);else if (key === 'file_view') VC.L.Storage.set(key, {}, true);else if (key === 'recomends_scan') VC.L.Storage.set(key, {}, true);else if (key === 'recomends_list') VC.L.Storage.set(key, [], true);else if (key === 'timetable') VC.L.Storage.set(key, {}, true);else if (key === 'account_bookmarks') VC.L.Storage.set(key, [], true);
        });
        if (Lampa.Favorite && Lampa.Favorite.read) Lampa.Favorite.read(true);
        if (Lampa.Timeline && Lampa.Timeline.read) Lampa.Timeline.read(true);
      };
      VC.applyBackupForActiveProfile = function () {
        return VC.req('/connector/v1/backup/import').then(function (data) {
          var items = data && data.data ? data.data : {};
          Object.keys(items).forEach(function (key) {
            return localStorage.setItem(key, items[key]);
          });
          if (Lampa.Favorite && Lampa.Favorite.read) Lampa.Favorite.read(true);
          if (Lampa.Timeline && Lampa.Timeline.read) Lampa.Timeline.read(true);
        });
      };
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
              platform: Lampa.Platform.get ? Lampa.Platform.get() : 'lampa',
              appVersion: VC.L.Manifest.app_version || 'unknown',
              osVersion: navigator.userAgent || 'unknown',
              locale: VC.L.Storage.get('language', 'ru') || 'ru',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
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
        VC.req('/connector/v1/pair/start', {
          method: 'POST',
          body: {
            deviceName: VC.L.Storage.get('device_name', 'Lampa Device'),
            platform: 'Lampa',
            appVersion: VC.L.Manifest.app_version || 'unknown',
            deviceUid: VC.deviceUid(),
            clientNonce: Math.random().toString(36).slice(2)
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
      VC.normalizeProfiles = function (data) {
        var items = data && (data.items || data.profiles) || [];
        return items.map(function (profile) {
          var id = String(profile.id || '');
          var name = String(profile.name || '');
          var isDefault = !!(profile.is_default || profile.main);
          return {
            id: id,
            name: name,
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
              template: 'selectbox_icon',
              icon: VC.profileAvatarHtml(profile),
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
              var previousProfileId = VC.profile();
              if (previousProfileId) VC.saveCurrentProfileLocalState(previousProfileId);
              VC.req('/connector/v1/profiles/select', {
                method: 'POST',
                body: {
                  profileId: sel.profileId
                }
              }).then(function () {
                var selectedProfile = profiles.find(function (profile) {
                  return profile.id === String(sel.profileId);
                });
                VC.L.Storage.set(VC.KEY.profileId, String(sel.profileId));
                if (selectedProfile) {
                  VC._profilesCache = profiles;
                  VC._profilesCacheAt = Date.now();
                }
                VC.applyProfileLocalState(sel.profileId);
                VC.applyBackupForActiveProfile()["catch"](function () {})["finally"](function () {
                  VC.saveCurrentProfileLocalState(sel.profileId);
                });
                VC.pullCloudPluginsToStorage()["catch"](function () {});
                if (VC.L.Listener && VC.L.Listener.send) {
                  VC.L.Listener.send('profile_select', {
                    profile: {
                      id: sel.profileId,
                      name: sel.profileName || sel.title
                    }
                  });
                }
                if (VC.syncHeaderProfileButton) VC.syncHeaderProfileButton();
                VC.notify(VC.L.Lang.translate('vatra_profile_switched'));
                VC.reloadAppSoon(VC.L.Lang.translate('vatra_profile_changed'));
              })["catch"](function (e) {
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
      VC.backupExport = function () {
        VC.ensureCubSafe(VC.L.Lang.translate('vatra_backup_export'), function () {
          var payload = {};
          var skip = {
            vatra_connector_token: true,
            vatra_connector_refresh: true
          };
          Object.keys(localStorage).forEach(function (key) {
            if (skip[key]) return;
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
              localStorage.setItem(key, items[key]);
              imported += 1;
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
      VC.normalizePlugins = function (list) {
        return (list || []).map(function (plugin) {
          if (typeof plugin === 'string') {
            return {
              url: plugin,
              status: 1,
              name: plugin
            };
          }
          return {
            url: plugin.url,
            status: plugin.status ? 1 : 0,
            name: plugin.name || plugin.url
          };
        }).filter(function (plugin) {
          return plugin.url;
        });
      };
      VC.pushPluginsToCloud = function (list) {
        var normalized = VC.normalizePlugins(list);
        return VC.req('/connector/v1/plugins/sync', {
          method: 'POST',
          body: {
            plugins: normalized
          }
        });
      };
      VC.pullCloudPluginsToStorage = function () {
        return VC.req('/connector/v1/plugins').then(function (data) {
          var cloud = VC.normalizePlugins(data.plugins || []);
          var local = VC.normalizePlugins(VC.L.Storage.get('plugins', '[]'));
          var map = {};
          local.forEach(function (plugin) {
            return map[plugin.url] = plugin;
          });
          cloud.forEach(function (plugin) {
            return map[plugin.url] = plugin;
          });
          var merged = Object.keys(map).map(function (key) {
            return map[key];
          });
          VC._skipPluginPushOnce = true;
          VC.L.Storage.set('plugins', merged);
          return merged;
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
        if (VC.profileAvatarHtml) button.append(VC.profileAvatarHtml(profile));else if (VC.L.Template && VC.L.Template.js) button.append(VC.L.Template.js('icon_profile'));else button.append(VC.defaultProfileIconSvg ? VC.defaultProfileIconSvg() : '');
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
            if (e.name === 'account_use' || e.name === 'account_sync' || e.name === VC.KEY.token || e.name === VC.KEY.profileId) {
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
      VC.contentKeyFromCard = function (card) {
        if (!card) return '';
        var source = card.source || card.source_type || 'tmdb';
        var id = card.id || card.card_id || card.kinopoisk_id || '';
        if (!id) return '';
        return source + ':' + id;
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
      VC.syncFavoriteState = function (event) {
        if (!VC.token()) return;
        var profileId = VC.profile();
        if (!profileId) return;
        if (!event || event.reason !== 'update') return;
        if (event.target !== 'favorite') return;
        var card = event.card;
        var contentKey = VC.contentKeyFromCard(card);
        if (!contentKey) return;
        var bucket = event.type || 'bookmarks';
        if (bucket === 'wath') bucket = 'watch';
        VC.scheduleStateSync('bookmark:' + contentKey + ':' + bucket, function () {
          VC.req('/state/bookmarks', {
            method: 'PUT',
            body: {
              profileId: profileId,
              contentKey: contentKey,
              bucket: bucket
            }
          })["catch"](function () {});
        });
      };
      VC.bindStateSync = function () {
        if (!VC.L.Listener || !VC.L.Listener.follow) return;
        VC.L.Listener.follow('state:changed', function (event) {
          if (!event) return;
          if (event.target === 'timeline' && event.reason === 'update' && event.data) {
            VC.syncTimelineState(event.data);
            return;
          }
          if (event.target === 'favorite') VC.syncFavoriteState(event);
        });
      };
    }

    function initMain(VC) {
      VC.removeLegacyMenuButton = function () {
        $('.menu .menu__list:eq(0) .menu__item').each(function () {
          var text = $(this).find('.menu__text').text().trim();
          if (text === 'Vatra') $(this).remove();
        });
      };
      VC.bindProfileAndPlugins = function () {
        var syncTimer = 0;
        if (VC.profile()) {
          VC.applyProfileLocalState(VC.profile());
          VC.applyBackupForActiveProfile()["catch"](function () {});
        }
        VC.pullCloudPluginsToStorage()["catch"](function () {});
        if (VC.L.Listener && VC.L.Listener.follow) {
          VC.L.Listener.follow('profile_select', function () {
            VC.pullCloudPluginsToStorage()["catch"](function () {});
          });
        }
        if (VC.L.Storage && VC.L.Storage.listener) {
          VC.L.Storage.listener.follow('change', function (e) {
            if (!e || e.name !== 'plugins') return;
            if (!VC.token()) return;
            if (VC._skipPluginPushOnce) {
              VC._skipPluginPushOnce = false;
              return;
            }
            clearTimeout(syncTimer);
            syncTimer = setTimeout(function () {
              var localPlugins = VC.L.Storage.get('plugins', '[]');
              VC.pushPluginsToCloud(localPlugins).then(function () {
                VC.reloadAppSoon(VC.L.Lang.translate('vatra_plugins_synced'));
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
