// TroikaInitiative.js - v1.4.0
// Troika! RPG Initiative Tracker for Roll20
var TroikaInitiative = TroikaInitiative || (function () {
    'use strict';

    var SCRIPT_NAME = 'TroikaInitiative';
    var VERSION = '1.4.0';
    var SCHEMA_VER = 1.4;
    var END_OF_ROUND = '__END_OF_ROUND__';
    var MONSTER_POOL = '__MONSTER_POOL__';

    var COLORS = {
        bg: '#f5e6d3',
        border: '#8b5a2b',
        header: '#4682b4',
        playerCard: '#90ee90',
        monsterCard: '#ffb6c1',
        endCard: '#ffd700',
        text: '#3e2723',
        muted: '#6d4c41',
        button: '#8b5a2b',
        buttonText: '#ffffff',
        dangerBtn: '#a63e2a',
        successBtn: '#2a7a3e'
    };

    function css(obj) {
        var result = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                result.push(k + ':' + obj[k]);
            }
        }
        return result.join(';');
    }

    var S = {
        wrap: css({
            'background': COLORS.bg,
            'border': '2px solid ' + COLORS.border,
            'border-radius': '8px',
            'padding': '10px 12px',
            'font-family': '"Palatino Linotype", Palatino, serif',
            'color': COLORS.text,
            'font-size': '14px'
        }),
        header: css({
            'color': COLORS.header,
            'font-weight': 'bold',
            'font-size': '16px',
            'border-bottom': '2px solid ' + COLORS.border,
            'padding-bottom': '5px',
            'margin-bottom': '8px'
        }),
        playerPill: css({
            'background': COLORS.playerCard,
            'color': '#1a3c1a',
            'border-radius': '4px',
            'padding': '2px 8px',
            'font-weight': 'bold',
            'font-size': '13px'
        }),
        monsterPill: css({
            'background': COLORS.monsterCard,
            'color': '#4a0e1f',
            'border-radius': '4px',
            'padding': '2px 8px',
            'font-weight': 'bold',
            'font-size': '13px'
        }),
        endPill: css({
            'background': COLORS.endCard,
            'color': '#3d2b0c',
            'border-radius': '4px',
            'padding': '2px 8px',
            'font-weight': 'bold',
            'font-size': '13px'
        }),
        button: css({
            'background': COLORS.button,
            'color': COLORS.buttonText,
            'border': '1px solid ' + COLORS.header,
            'border-radius': '4px',
            'padding': '3px 10px',
            'font-weight': 'bold',
            'font-size': '13px',
            'cursor': 'pointer'
        }),
        smallBtn: css({
            'background': COLORS.button,
            'color': COLORS.buttonText,
            'border': '1px solid ' + COLORS.header,
            'border-radius': '3px',
            'padding': '1px 6px',
            'font-weight': 'bold',
            'font-size': '11px',
            'cursor': 'pointer',
            'text-decoration': 'none'
        }),
        playerBtn: css({
            'background': COLORS.successBtn,
            'color': COLORS.buttonText,
            'border': '1px solid ' + COLORS.successBtn,
            'border-radius': '3px',
            'padding': '1px 6px',
            'font-weight': 'bold',
            'font-size': '11px',
            'cursor': 'pointer',
            'text-decoration': 'none'
        }),
        monsterBtn: css({
            'background': COLORS.dangerBtn,
            'color': COLORS.buttonText,
            'border': '1px solid ' + COLORS.dangerBtn,
            'border-radius': '3px',
            'padding': '1px 6px',
            'font-weight': 'bold',
            'font-size': '11px',
            'cursor': 'pointer',
            'text-decoration': 'none'
        }),
        removeBtn: css({
            'background': '#666',
            'color': COLORS.buttonText,
            'border': '1px solid #444',
            'border-radius': '3px',
            'padding': '1px 6px',
            'font-weight': 'bold',
            'font-size': '11px',
            'cursor': 'pointer',
            'text-decoration': 'none'
        }),
        muted: css({
            'color': COLORS.muted,
            'font-size': '12px'
        }),
        row: css({
            'margin': '4px 0'
        })
    };

    function checkState() {
        if (!state[SCRIPT_NAME]) {
            state[SCRIPT_NAME] = {
                schemaVersion: SCHEMA_VER,
                combatants: [],
                deck: [],
                discard: [],
                active: false,
                setupMode: false,
                editMode: false
            };
        }
        var s = state[SCRIPT_NAME];
        if (!s.discard) s.discard = [];
        if (s.setupMode === undefined) s.setupMode = false;
        if (s.editMode === undefined) s.editMode = false;
    }

    function gs() {
        return state[SCRIPT_NAME];
    }

    function shuffle(arr) {
        var i, j, tmp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }

    // Build deck: players get individual cards, ALL monster cards go into
    // a shared pool so any drawn monster card means "any monster acts"
    function buildDeck() {
        var s = gs();
        var cards = [];
        _.each(s.combatants, function(c) {
            if (c.type === 'player') {
                for (var i = 0; i < c.cardCount; i++) {
                    cards.push(c.id);
                }
            } else {
                for (var j = 0; j < c.cardCount; j++) {
                    cards.push(MONSTER_POOL);
                }
            }
        });
        cards.push(END_OF_ROUND);
        return shuffle(cards);
    }

    function getTotalMonsterCards() {
        var s = gs();
        return _.reduce(s.combatants, function(sum, c) {
            return c.type === 'monster' ? sum + c.cardCount : sum;
        }, 0);
    }

    function toGM(html) {
        sendChat(SCRIPT_NAME, '/w gm <div style="' + S.wrap + '">' + html + '</div>');
    }

    function toAll(html) {
        sendChat(SCRIPT_NAME, '<div style="' + S.wrap + '">' + html + '</div>');
    }

    function btn(label, cmd) {
        return '<a href="' + cmd + '" style="' + S.button + '">' + label + '</a>';
    }

    function smallBtn(label, cmd) {
        return '<a href="' + cmd + '" style="' + S.smallBtn + '">' + label + '</a>';
    }

    function playerBtnLink(label, cmd) {
        return '<a href="' + cmd + '" style="' + S.playerBtn + '">' + label + '</a>';
    }

    function monsterBtnLink(label, cmd) {
        return '<a href="' + cmd + '" style="' + S.monsterBtn + '">' + label + '</a>';
    }

    function removeBtnLink(label, cmd) {
        return '<a href="' + cmd + '" style="' + S.removeBtn + '">' + label + '</a>';
    }

    function getTokenName(token) {
        if (!token) return 'Unknown';
        var charId = token.get('represents');
        if (charId) {
            var character = getObj('character', charId);
            if (character) return character.get('name');
        }
        return token.get('name') || 'Unknown';
    }

    function nextId() {
        var s = gs();
        var max = 0;
        _.each(s.combatants, function(c) {
            var m = c.id.match(/_(\d+)$/);
            if (m) {
                var n = parseInt(m[1], 10);
                if (n > max) max = n;
            }
        });
        return max + 1;
    }

    function buildRosterTable() {
        var s = gs();
        var playerCount = 0;
        var monsterCount = 0;
        var totalCards = 0;

        var html = '<table style="width:100%;margin-top:8px;border-collapse:collapse;border-spacing:0">';
        html += '<tr style="border-bottom:1px solid ' + COLORS.border + '">';
        html += '<td style="padding:4px;font-weight:bold">Name</td>';
        html += '<td style="padding:4px;font-weight:bold">Role</td>';
        html += '<td style="padding:4px;font-weight:bold">Cards</td>';
        html += '<td style="padding:4px;font-weight:bold"></td>';
        html += '</tr>';

        _.each(s.combatants, function(c) {
            var isPlayer = (c.type === 'player');
            var pill, roleBtn, cardsCell, removeCell;

            if (isPlayer) {
                playerCount++;
                totalCards += 2;
                pill = '<span style="' + S.playerPill + '">' + c.name + '</span>';
                roleBtn = monsterBtnLink('&#8594; Monster', '!troika settype ' + c.id + ' monster');
                cardsCell = '2';
            } else {
                monsterCount++;
                totalCards += c.cardCount;
                pill = '<span style="' + S.monsterPill + '">' + c.name + '</span>';
                roleBtn = playerBtnLink('&#8594; Player', '!troika settype ' + c.id + ' player');
                cardsCell = smallBtn('' + c.cardCount, '!troika setcards ' + c.id + ' ?{Cards 1-9|1|2|3|4|5|6|7|8|9}');
            }
            removeCell = removeBtnLink('&#10006;', '!troika drop ' + c.id);

            html += '<tr style="border-bottom:1px solid ' + COLORS.border + '">';
            html += '<td style="padding:4px">' + pill + '</td>';
            html += '<td style="padding:4px">' + roleBtn + '</td>';
            html += '<td style="padding:4px;text-align:center">' + cardsCell + '</td>';
            html += '<td style="padding:4px;text-align:center">' + removeCell + '</td>';
            html += '</tr>';
        });

        html += '</table>';
        totalCards += 1;
        html += '<div style="' + S.muted + ';margin-top:8px">';
        html += playerCount + ' player(s), ' + monsterCount + ' monster(s), ';
        html += totalCards + ' total cards (incl. End of Round)';
        html += '</div>';

        return { html: html, playerCount: playerCount, monsterCount: monsterCount, totalCards: totalCards };
    }

    function showSetupMenu() {
        var s = gs();
        if (!s.setupMode || s.combatants.length === 0) {
            toGM('No active setup. Run <code>!troika start</code> first.');
            return;
        }

        var roster = buildRosterTable();
        var html = '<div style="' + S.header + '">&#9879; Troika! Initiative Setup</div>';
        html += '<div style="' + S.row + '">Toggle <b>Player</b>/<b>Monster</b>, set card counts, or remove:</div>';
        html += roster.html;
        html += '<div style="' + S.muted + ';margin-top:6px">Select new tokens on the map &#8594; <code>!troika addtoken</code></div>';
        html += '<div style="margin-top:10px">';
        html += btn('&#9989; Confirm', '!troika confirm');
        html += ' ' + btn('&#128260; Refresh', '!troika show');
        html += ' ' + btn('&#10060; Cancel', '!troika cancel');
        html += '</div>';
        toGM(html);
    }

    function showEditMenu() {
        var s = gs();
        if (!s.editMode) {
            toGM('No edit session active.');
            return;
        }

        var roster = buildRosterTable();
        var html = '<div style="' + S.header + '">&#9879; End of Round &#8212; Edit Roster</div>';
        html += '<div style="' + S.row + '">Add/remove combatants or change roles before next round:</div>';
        html += roster.html;
        html += '<div style="' + S.muted + ';margin-top:6px">Select new tokens on the map &#8594; <code>!troika addtoken</code></div>';
        html += '<div style="' + S.muted + '"><code>!troika addmanual &lt;name&gt; player|monster [cards]</code></div>';
        html += '<div style="margin-top:10px">';
        html += btn('&#9654; Resume Combat', '!troika resume');
        html += ' ' + btn('&#128260; Refresh', '!troika editshow');
        html += ' ' + btn('&#9209; End Combat', '!troika end');
        html += '</div>';
        toGM(html);
    }

    function cmdStart(msg) {
        if (!msg.selected || !msg.selected.length) {
            toGM('<b style="color:' + COLORS.muted + '">No tokens selected.</b> Select all combatant tokens then run <code>!troika start</code>.');
            return;
        }

        var s = gs();
        s.combatants = [];
        s.deck = [];
        s.discard = [];
        s.active = false;
        s.setupMode = true;
        s.editMode = false;

        _.each(msg.selected, function(sel) {
            var token = getObj('graphic', sel._id);
            if (!token) return;
            var name = getTokenName(token);
            s.combatants.push({
                id: 'token_' + sel._id,
                name: name,
                type: 'monster',
                tokenId: sel._id,
                cardCount: 2
            });
        });

        if (s.combatants.length === 0) {
            toGM('<b>No valid tokens found.</b>');
            s.setupMode = false;
            return;
        }

        log('TROIKA_START: tokens=' + s.combatants.length);
        showSetupMenu();
    }

    function cmdAddToken(msg) {
        var s = gs();
        if (!s.setupMode && !s.editMode) {
            toGM('No active setup or edit. Run <code>!troika start</code> first.');
            return;
        }
        if (!msg.selected || !msg.selected.length) {
            toGM('No tokens selected. Select tokens on the map first.');
            return;
        }

        var added = 0;
        _.each(msg.selected, function(sel) {
            var token = getObj('graphic', sel._id);
            if (!token) return;
            var existingId = 'token_' + sel._id;
            if (_.find(s.combatants, function(c) { return c.id === existingId; })) return;
            s.combatants.push({
                id: existingId,
                name: getTokenName(token),
                type: 'monster',
                tokenId: sel._id,
                cardCount: 2
            });
            added++;
        });

        if (added === 0) {
            toGM('No new tokens to add (already in roster or invalid).');
        } else {
            log('TROIKA_ADDTOKEN: added=' + added);
        }

        if (s.setupMode) showSetupMenu();
        else if (s.editMode) showEditMenu();
    }

    function cmdAddManual(args) {
        var s = gs();
        if (!s.setupMode && !s.editMode) {
            toGM('No active setup or edit session.');
            return;
        }

        var name = args[0];
        var type = (args[1] || 'monster').toLowerCase();
        var cards = parseInt(args[2], 10);

        if (!name) {
            toGM('Usage: <code>!troika addmanual &lt;name&gt; player|monster [cards]</code>');
            return;
        }
        if (type !== 'player' && type !== 'monster') type = 'monster';
        if (type === 'player') {
            cards = 2;
        } else {
            if (isNaN(cards) || cards < 1 || cards > 9) cards = 2;
        }

        s.combatants.push({
            id: 'manual_' + nextId(),
            name: name,
            type: type,
            tokenId: null,
            cardCount: cards
        });

        log('TROIKA_ADDMANUAL: name="' + name + '" type=' + type + ' cards=' + cards);
        if (s.setupMode) showSetupMenu();
        else if (s.editMode) showEditMenu();
    }

    function cmdSetType(args) {
        var s = gs();
        if (!s.setupMode && !s.editMode) {
            toGM('No active setup or edit session.');
            return;
        }

        var targetId = args[0];
        var newType = args[1];
        if (!targetId || !newType || (newType !== 'player' && newType !== 'monster')) return;

        var combatant = _.find(s.combatants, function(c) { return c.id === targetId; });
        if (!combatant) return;

        combatant.type = newType;
        if (newType === 'player') combatant.cardCount = 2;

        log('TROIKA_SETTYPE: name="' + combatant.name + '" type=' + newType);
        if (s.setupMode) showSetupMenu();
        else if (s.editMode) showEditMenu();
    }

    function cmdSetCards(args) {
        var s = gs();
        if (!s.setupMode && !s.editMode) {
            toGM('No active setup or edit session.');
            return;
        }

        var targetId = args[0];
        var count = parseInt(args[1], 10);
        if (!targetId || isNaN(count) || count < 1 || count > 9) return;

        var combatant = _.find(s.combatants, function(c) { return c.id === targetId; });
        if (!combatant) return;

        if (combatant.type === 'player') {
            toGM('Players always have 2 cards.');
            return;
        }

        combatant.cardCount = count;
        log('TROIKA_SETCARDS: name="' + combatant.name + '" count=' + count);
        if (s.setupMode) showSetupMenu();
        else if (s.editMode) showEditMenu();
    }

    function cmdDrop(args) {
        var s = gs();
        if (!s.setupMode && !s.editMode) {
            toGM('No active setup or edit session.');
            return;
        }

        var targetId = args[0];
        if (!targetId) return;

        var idx = -1;
        _.each(s.combatants, function(c, i) {
            if (c.id === targetId) idx = i;
        });
        if (idx === -1) return;

        var removed = s.combatants.splice(idx, 1)[0];
        if (s.editMode) {
            s.deck = _.filter(s.deck, function(id) { return id !== removed.id; });
            s.discard = _.filter(s.discard, function(id) { return id !== removed.id; });
        }

        log('TROIKA_DROP: name="' + removed.name + '"');
        if (s.setupMode) showSetupMenu();
        else if (s.editMode) showEditMenu();
    }

    function showCombatStartSummary() {
        var s = gs();
        var totalCards = s.deck.length;
        var playerCount = _.filter(s.combatants, function(c) { return c.type === 'player'; }).length;
        var monsterCount = _.filter(s.combatants, function(c) { return c.type === 'monster'; }).length;
        var totalMonsterCards = getTotalMonsterCards();

        var html = '<div style="' + S.header + '">&#9879; Troika! Initiative &#8212; Combat Begins</div>';
        html += '<div style="' + S.row + '">Deck: <b>' + totalCards + '</b> cards</div>';

        _.each(_.filter(s.combatants, function(c) { return c.type === 'player'; }), function(c) {
            html += '<div style="' + S.row + '"><span style="' + S.playerPill + '">' + c.name + '</span> &#8212; 2 cards</div>';
        });

        if (monsterCount > 0) {
            html += '<div style="' + S.row + '"><span style="' + S.monsterPill + '">Monster Pool</span> &#8212; ' + totalMonsterCards + ' shared cards (';
            var monsterNames = [];
            _.each(_.filter(s.combatants, function(c) { return c.type === 'monster'; }), function(c) {
                monsterNames.push(c.name + ' x' + c.cardCount);
            });
            html += monsterNames.join(', ') + ')</div>';
        }

        html += '<div style="' + S.row + '"><span style="' + S.endPill + '">END OF ROUND</span> &#8212; 1 card</div>';
        html += '<div style="margin-top:10px">' + btn('&#9654; Draw First Card', '!troika draw') + ' ' + btn('&#128202; Status', '!troika status') + '</div>';

        toAll(html);
        log('TROIKA_CONFIRM: deck=' + totalCards + ' players=' + playerCount + ' monsters=' + monsterCount + ' monsterCards=' + totalMonsterCards);
    }

    function cmdConfirm() {
        var s = gs();
        if (!s.setupMode) {
            toGM('No active setup.');
            return;
        }
        if (s.combatants.length === 0) {
            toGM('Cannot confirm with zero combatants.');
            return;
        }

        s.deck = buildDeck();
        s.discard = [];
        s.active = true;
        s.setupMode = false;
        s.editMode = false;

        showCombatStartSummary();
    }

    function cmdResume() {
        var s = gs();
        if (!s.editMode) {
            toGM('No edit session active.');
            return;
        }
        if (s.combatants.length === 0) {
            toGM('Cannot resume with zero combatants.');
            return;
        }

        s.deck = buildDeck();
        s.discard = [];
        s.active = true;
        s.editMode = false;

        showCombatStartSummary();
    }

    function cmdCancel() {
        var s = gs();
        s.setupMode = false;
        s.editMode = false;
        s.combatants = [];
        s.deck = [];
        s.discard = [];
        s.active = false;
        toAll('<div style="' + S.header + '">&#9879; Setup Cancelled</div><div>Combat initiation aborted.</div>');
        log('TROIKA_CANCEL');
    }

    function cmdDraw() {
        var s = gs();
        if (!s.active) {
            toGM('No active combat. Run <code>!troika start</code> first.');
            return;
        }
        if (s.deck.length === 0) {
            toAll('<div style="' + S.header + '">&#9879; Deck Empty</div><div>Reshuffling...</div>');
            s.deck = buildDeck();
            s.discard = [];
        }

        var drawn = s.deck.pop();
        s.discard.push(drawn);

        if (drawn === END_OF_ROUND) {
            var cardsDrawn = s.discard.length;
            s.active = false;
            s.editMode = true;

            var html = '<div style="' + S.header + '">&#8987; END OF ROUND</div>';
            html += '<div style="' + S.row + '">The round is over. <b>' + cardsDrawn + '</b> card' + (cardsDrawn !== 1 ? 's' : '') + ' drawn.</div>';
            html += '<div style="' + S.muted + '">You may add or remove combatants before next round.</div>';
            html += '<div style="margin-top:10px">';
            html += btn('&#9654; Next Round', '!troika resume');
            html += ' ' + btn('&#9998; Edit Roster', '!troika editshow');
            html += ' ' + btn('&#9209; End Combat', '!troika end');
            html += '</div>';
            toAll(html);
            log('TROIKA_DRAW: END_OF_ROUND drawn=' + cardsDrawn);

        } else if (drawn === MONSTER_POOL) {
            var remaining = s.deck.length;
            var monsterNames = [];
            _.each(_.filter(s.combatants, function(c) { return c.type === 'monster'; }), function(c) {
                monsterNames.push(c.name);
            });

            var flavorMonster = [
                'The darkness stirs...',
                'Claws scrape on stone.',
                'Something horrible moves.',
                'Malice given form.',
                'The enemy strikes!'
            ];
            var flavor = flavorMonster[Math.floor(Math.random() * flavorMonster.length)];

            var html = '<div style="' + S.header + '">&#9879; Monster Card Drawn!</div>';
            html += '<div style="' + S.row + '"><span style="' + S.monsterPill + '">Any monster can act now</span></div>';
            html += '<div style="' + S.row + '"><i style="' + S.muted + '">' + flavor + '</i></div>';
            html += '<div style="' + S.muted + '">Active monsters: ' + monsterNames.join(', ') + '</div>';
            html += '<div style="' + S.muted + '">' + remaining + ' card' + (remaining !== 1 ? 's' : '') + ' remain.</div>';
            html += '<div style="margin-top:10px">' + btn('&#9654; Draw Next', '!troika draw') + ' ' + btn('&#128202; Status', '!troika status') + '</div>';

            toAll(html);
            log('TROIKA_DRAW: MONSTER_POOL remaining=' + remaining);

        } else {
            var combatant = _.find(s.combatants, function(c) { return c.id === drawn; });
            if (!combatant) {
                log('TROIKA_DRAW: stale id=' + drawn + ' skipping');
                cmdDraw();
                return;
            }

            var remaining = s.deck.length;
            var flavorPlayer = [
                'Fortune favours the bold!',
                'Now - act!',
                'Your moment!',
                'The stars align!',
                'Move quickly!'
            ];
            var flavor = flavorPlayer[Math.floor(Math.random() * flavorPlayer.length)];

            var html = '<div style="' + S.header + '">&#9879; Card Drawn!</div>';
            html += '<div style="' + S.row + '"><span style="' + S.playerPill + '">' + combatant.name + '</span> <i style="' + S.muted + '">' + flavor + '</i></div>';
            html += '<div style="' + S.muted + '">' + remaining + ' card' + (remaining !== 1 ? 's' : '') + ' remain.</div>';
            html += '<div style="margin-top:10px">' + btn('&#9654; Draw Next', '!troika draw') + ' ' + btn('&#128202; Status', '!troika status') + '</div>';

            toAll(html);
            log('TROIKA_DRAW: player="' + combatant.name + '" remaining=' + remaining);
        }
    }

    function cmdStatus() {
        var s = gs();
        if (!s.active) {
            toGM('No active combat.');
            return;
        }

        var counts = {};
        _.each(s.deck, function(id) {
            counts[id] = (counts[id] || 0) + 1;
        });

        var html = '<div style="' + S.header + '">&#128202; Deck Status</div>';
        html += '<div style="' + S.muted + '">' + s.deck.length + ' remaining, ' + s.discard.length + ' drawn this round</div>';
        html += '<table style="width:100%;margin-top:4px;border-collapse:collapse">';

        // Players
        _.each(_.filter(s.combatants, function(c) { return c.type === 'player'; }), function(c) {
            var n = counts[c.id] || 0;
            var filled = '';
            var empty = '';
            for (var i = 0; i < n; i++) filled += '&#9679;';
            for (var j = 0; j < Math.max(0, 2 - n); j++) empty += '&#9675;';
            html += '<tr><td style="padding:2px 4px"><span style="' + S.playerPill + '">' + c.name + '</span></td>';
            html += '<td style="color:' + COLORS.muted + ';font-size:12px">' + filled + empty + ' (' + n + '/2)</td></tr>';
        });

        // Monster pool
        var monsterLeft = counts[MONSTER_POOL] || 0;
        var totalMonsterCards = getTotalMonsterCards();
        var mFilled = '';
        var mEmpty = '';
        for (var mi = 0; mi < monsterLeft; mi++) mFilled += '&#9679;';
        for (var mj = 0; mj < Math.max(0, totalMonsterCards - monsterLeft); mj++) mEmpty += '&#9675;';
        html += '<tr><td style="padding:2px 4px"><span style="' + S.monsterPill + '">Monster Pool</span></td>';
        html += '<td style="color:' + COLORS.muted + ';font-size:12px">' + mFilled + mEmpty + ' (' + monsterLeft + '/' + totalMonsterCards + ')</td></tr>';

        // End of round
        var endLeft = counts[END_OF_ROUND] || 0;
        html += '<tr><td style="padding:2px 4px"><span style="' + S.endPill + '">End of Round</span></td>';
        html += '<td style="color:' + COLORS.muted + ';font-size:12px">' + (endLeft ? '&#9679;' : '&#9675;') + ' (' + endLeft + '/1)</td></tr>';

        html += '</table>';
        html += '<div style="margin-top:6px">' + btn('&#9654; Draw', '!troika draw') + '</div>';
        toGM(html);
    }

    function cmdReshuffle() {
        var s = gs();
        if (!s.active) {
            toGM('No active combat.');
            return;
        }
        s.deck = buildDeck();
        s.discard = [];
        toAll('<div style="' + S.header + '">&#9879; Deck Reshuffled</div><div>All cards returned and shuffled.</div>');
        log('TROIKA_RESHUFFLE');
    }

    function cmdRemove(args) {
        var s = gs();
        if (!s.active) {
            toGM('No active combat.');
            return;
        }
        var name = args.join(' ').trim().toLowerCase();
        if (!name) {
            toGM('Usage: <code>!troika remove &lt;name&gt;</code>');
            return;
        }
        var idx = -1;
        _.each(s.combatants, function(c, i) {
            if (c.name.toLowerCase() === name) idx = i;
        });
        if (idx === -1) {
            toGM('No combatant named "' + args.join(' ') + '" found.');
            return;
        }
        var removed = s.combatants.splice(idx, 1)[0];
        s.deck = _.filter(s.deck, function(id) { return id !== removed.id; });
        s.discard = _.filter(s.discard, function(id) { return id !== removed.id; });
        toAll('<div style="' + S.header + '">&#9879; Removed</div><div><b>' + removed.name + '</b> removed from combat.</div>');
        log('TROIKA_REMOVE: name="' + removed.name + '"');
    }

    function cmdEnd() {
        var s = gs();
        s.combatants = [];
        s.deck = [];
        s.discard = [];
        s.active = false;
        s.setupMode = false;
        s.editMode = false;
        toAll('<div style="' + S.header + '">&#9879; Combat Ended</div><div>The initiative deck has been cleared.</div>');
        log('TROIKA_END');
    }

    function cmdHelp() {
        var cmds = [
            ['!troika start', 'Select tokens, run. Shows setup menu.'],
            ['!troika show', 'Re-show setup menu.'],
            ['!troika addtoken', 'Add selected tokens to roster.'],
            ['!troika addmanual &lt;name&gt; type [N]', 'Add without token.'],
            ['!troika confirm', 'Build deck, start combat.'],
            ['!troika draw', 'Draw next card.'],
            ['!troika status', 'Deck status (GM).'],
            ['!troika reshuffle', 'Reshuffle all cards.'],
            ['!troika remove &lt;name&gt;', 'Remove by name.'],
            ['!troika end', 'End combat.']
        ];
        var html = '<div style="' + S.header + '">&#9879; Troika! Initiative - Help</div>';
        html += '<table style="width:100%;border-collapse:collapse">';
        _.each(cmds, function(row) {
            html += '<tr><td style="padding:2px 4px;color:' + COLORS.header + ';font-size:11px;white-space:nowrap"><code>' + row[0] + '</code></td>';
            html += '<td style="padding:2px 4px;color:' + COLORS.muted + ';font-size:12px">' + row[1] + '</td></tr>';
        });
        html += '</table>';
        html += '<div style="margin-top:6px;' + S.muted + '">Players get 2 unique cards each. Monsters share a combined pool. Draw until End of Round, then reshuffle.</div>';
        toGM(html);
    }

    function handleChat(msg) {
        if (msg.type !== 'api') return;
        if (!/^!troika(\s|$)/i.test(msg.content)) return;
        if (!playerIsGM(msg.playerid)) {
            sendChat(SCRIPT_NAME, '/w "' + msg.who + '" Only the GM can use Troika! Initiative commands.');
            return;
        }
        var parts = msg.content.trim().split(/\s+/);
        var sub = (parts[1] || 'help').toLowerCase();
        var args = parts.slice(2);
        switch (sub) {
            case 'start':     cmdStart(msg); break;
            case 'show':      showSetupMenu(); break;
            case 'editshow':  showEditMenu(); break;
            case 'addtoken':  cmdAddToken(msg); break;
            case 'addmanual': cmdAddManual(args); break;
            case 'settype':   cmdSetType(args); break;
            case 'setcards':  cmdSetCards(args); break;
            case 'drop':      cmdDrop(args); break;
            case 'confirm':   cmdConfirm(); break;
            case 'resume':    cmdResume(); break;
            case 'cancel':    cmdCancel(); break;
            case 'draw':      cmdDraw(); break;
            case 'status':    cmdStatus(); break;
            case 'reshuffle': cmdReshuffle(); break;
            case 'remove':    cmdRemove(args); break;
            case 'end':       cmdEnd(); break;
            case 'help':      cmdHelp(); break;
            default:          cmdHelp(); break;
        }
    }

    on('chat:message', handleChat);

    on('ready', function() {
        checkState();
        log('TROIKA_INIT: v' + VERSION + ' ready');
        sendChat(SCRIPT_NAME, '/w gm <div style="' + S.wrap + '"><span style="' + S.header + '">&#9879; Troika! Initiative v' + VERSION + ' loaded.</span> Type <code>!troika help</code> to get started.</div>');
    });

    return { version: VERSION };
})();
