(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [974],
  {
    1011: (e) => {
      e.exports = {
        cardWrapper: 'Card_cardWrapper__yBo_c',
        card: 'Card_card__YRoaV',
        image: 'Card_image__8x_Oz',
        content: 'Card_content__Z_4qY',
        title: 'Card_title__w2GYr',
        description: 'Card_description__kIgGP',
        checkboxWrapper: 'Card_checkboxWrapper__BD1Px',
      };
    },
    2237: (e) => {
      e.exports = {
        header: 'Header_header__kbMt1',
        title: 'Header_title__nUUDX',
        glowTitle: 'Header_glowTitle__FhKVp',
        subtitle: 'Header_subtitle__H90XD',
      };
    },
    2419: (e, t, r) => {
      'use strict';
      r.d(t, { Ay: () => l, N0: () => s, wr: () => n });
      let a = (0, r(1990).Z0)({
          name: 'selection',
          initialState: { selectedIds: [] },
          reducers: {
            toggleSelection(e, t) {
              let r = t.payload;
              e.selectedIds.includes(r)
                ? (e.selectedIds = e.selectedIds.filter((e) => e !== r))
                : e.selectedIds.push(r);
            },
            clearSelection(e) {
              e.selectedIds = [];
            },
          },
        }),
        { toggleSelection: s, clearSelection: n } = a.actions,
        l = a.reducer;
    },
    3375: (e) => {
      e.exports = {
        pagination: 'Pagination_pagination__ArTzy',
        button: 'Pagination_button__JAjkr',
        pulse: 'Pagination_pulse__TXNbW',
        page: 'Pagination_page__Cqlf_',
      };
    },
    3471: (e) => {
      e.exports = { wrapper: 'CardList_wrapper__0XETc' };
    },
    4861: (e) => {
      e.exports = {
        errorBoundary: 'ErrorBoundary_errorBoundary__IBBvf',
        reloadButton: 'ErrorBoundary_reloadButton__h4b8M',
      };
    },
    5064: (e, t, r) => {
      'use strict';
      r.d(t, { default: () => Y });
      var a = r(5155),
        s = r(2115),
        n = r(5695);
      let l = function (e, t) {
        let [r, a] = (0, s.useState)(() => {
          try {
            let r = localStorage.getItem(e);
            return null !== r ? JSON.parse(r) : t;
          } catch (e) {
            return t;
          }
        });
        return [
          r,
          (t) => {
            try {
              let s = t instanceof Function ? t(r) : t;
              (a(s), localStorage.setItem(e, JSON.stringify(s)));
            } catch (t) {
              console.error(
                'Error setting localStorage key "'.concat(e, '":'),
                Error
              );
            }
          },
        ];
      };
      var i = r(6874),
        o = r.n(i),
        c = r(1011),
        d = r.n(c);
      let u = (e) => {
        let {
            id: t,
            title: r,
            imageUrl: s,
            isSelected: n,
            onToggleSelect: l,
          } = e,
          i =
            (null == s ? void 0 : s.trim()) ||
            'https://placekitten.com/300/200';
        return (0, a.jsx)('div', {
          className: d().cardWrapper,
          children: (0, a.jsxs)(o(), {
            href: '/rs-react-app/details/'.concat(t),
            className: d().card,
            children: [
              (0, a.jsx)('div', {
                className: d().checkboxWrapper,
                children: (0, a.jsx)('input', {
                  type: 'checkbox',
                  checked: n,
                  onChange: (e) => {
                    (e.stopPropagation(), l(t));
                  },
                  onClick: (e) => e.stopPropagation(),
                }),
              }),
              (0, a.jsx)('img', {
                src: i,
                alt: r,
                className: d().image,
                loading: 'lazy',
                onError: (e) => {
                  e.currentTarget.src = 'https://placekitten.com/300/200';
                },
              }),
              (0, a.jsx)('div', {
                className: d().content,
                children: (0, a.jsx)('h3', {
                  className: d().title,
                  children: r,
                }),
              }),
            ],
          }),
        });
      };
      var h = r(9981),
        p = r.n(h);
      let _ = () =>
        (0, a.jsxs)('div', {
          className: ''.concat(p().card, ' ').concat(p().skeleton),
          'data-testid': 'card-skeleton-item',
          children: [
            (0, a.jsx)('div', { className: p().imageSkeleton }),
            (0, a.jsx)('div', { className: p().textSkeleton }),
            (0, a.jsx)('div', { className: p().textSkeleton }),
          ],
        });
      var m = r(6205),
        x = r.n(m);
      let g = () =>
        (0, a.jsxs)('div', {
          className: x().wrapper,
          'data-testid': 'card-skeleton',
          children: [
            (0, a.jsx)(_, {}),
            (0, a.jsx)(_, {}),
            (0, a.jsx)(_, {}),
            (0, a.jsx)(_, {}),
            (0, a.jsx)(_, {}),
            (0, a.jsx)(_, {}),
          ],
        });
      var j = r(3471),
        k = r.n(j);
      let v = (e) => {
        let {
          items: t,
          loading: r = !1,
          selectedIds: s,
          onToggleSelect: n,
        } = e;
        return r
          ? (0, a.jsx)(g, {})
          : (0, a.jsx)('div', {
              className: k().wrapper,
              children: t.map((e) => {
                let { id: t, imageId: r, title: l, imageUrl: i } = e;
                return (0, a.jsx)(
                  u,
                  {
                    id: t,
                    title: l,
                    imageUrl: i,
                    isSelected: s.includes(t),
                    onToggleSelect: n,
                  },
                  r
                );
              }),
            });
      };
      var S = r(2237),
        f = r.n(S),
        b = r(6263),
        w = r.n(b);
      let N = (e) => {
          let { onSearch: t, defaultValue: r = '' } = e,
            [n, l] = (0, s.useState)(r);
          return (
            (0, s.useEffect)(() => {
              l(r);
            }, [r]),
            (0, a.jsxs)('div', {
              className: w().search,
              children: [
                (0, a.jsx)('input', {
                  type: 'text',
                  value: n,
                  onChange: (e) => {
                    l(e.target.value);
                  },
                  className: w().input,
                  placeholder: 'Siberian',
                }),
                (0, a.jsx)('button', {
                  onClick: () => {
                    let e = n.trim();
                    (t(e), localStorage.setItem('searchTerm', e));
                  },
                  className: w().button,
                  children: 'Search',
                }),
              ],
            })
          );
        },
        B = (e) => {
          let { onSearch: t, defaultValue: r } = e;
          return (0, a.jsxs)('header', {
            className: f().header,
            children: [
              (0, a.jsx)('h1', {
                className: f().title,
                children: 'Discover Your Perfect Breed',
              }),
              (0, a.jsx)('p', {
                className: f().subtitle,
                children:
                  'Use the field below to find the cat breed you are interested in.',
              }),
              (0, a.jsx)('p', {
                className: f().subtitle,
                children:
                  'For example: Maine, Bengal, Sphynx, Norwegian, Persian, Ocicat, etc.',
              }),
              (0, a.jsx)(N, { onSearch: t, defaultValue: r }),
            ],
          });
        };
      var y = r(3375),
        C = r.n(y);
      let E = (e) => {
        let { currentPage: t, totalPages: r, onPageChange: s } = e;
        return (0, a.jsxs)('div', {
          className: C().pagination,
          children: [
            (0, a.jsx)('button', {
              onClick: () => s(t - 1),
              disabled: t <= 1,
              className: C().button,
              children: '← Previous',
            }),
            (0, a.jsxs)('span', {
              className: C().page,
              children: [t, ' из ', r],
            }),
            (0, a.jsx)('button', {
              onClick: () => s(t + 1),
              disabled: t >= r,
              className: C().button,
              children: 'Next →',
            }),
          ],
        });
      };
      var P = r(5785),
        I = r.n(P);
      let T = (e) => {
        let { selectedCount: t, onClear: r, onDownload: s } = e;
        return (0, a.jsxs)('div', {
          className: I().selectionBar,
          children: [
            (0, a.jsxs)('span', {
              children: ['Selected ', t, ' ', 1 === t ? 'element' : 'elements'],
            }),
            (0, a.jsxs)('div', {
              children: [
                (0, a.jsx)('button', { onClick: r, children: 'Deselect all' }),
                (0, a.jsx)('button', { onClick: s, children: 'Download' }),
              ],
            }),
          ],
        });
      };
      var M = r(5777),
        U = r.n(M);
      let L = { 'x-api-key': r(9509).env.CAT_API_KEY || '' };
      async function D() {
        let e = await fetch('https://api.thecatapi.com/v1/breeds', {
          headers: L,
          next: { revalidate: 60 },
        });
        if (!e.ok) throw Error('Failed to fetch breeds list');
        return e.json();
      }
      async function H(e) {
        if (!e.trim()) return [];
        let t = await fetch(
          'https://api.thecatapi.com/v1/breeds/search?q='.concat(
            encodeURIComponent(e)
          ),
          { headers: L, next: { revalidate: 60 } }
        );
        if (!t.ok) throw Error('Failed to fetch breeds');
        return t.json();
      }
      async function O(e, t) {
        let r =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [],
          a = r.length ? '&breed_ids='.concat(r.join(',')) : '',
          s = 'https://api.thecatapi.com/v1/images/search?limit='
            .concat(e, '&page=')
            .concat(t, '&order=ASC')
            .concat(a),
          n = await fetch(s, { headers: L, next: { revalidate: 60 } });
        if (!n.ok) throw Error('Failed to fetch images');
        return n.json();
      }
      async function A() {
        let e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
          t = e.length ? '&breed_ids='.concat(e.join(',')) : '',
          r = await fetch(
            'https://api.thecatapi.com/v1/images/search?limit=1&page=0'.concat(
              t
            ),
            { headers: L }
          );
        if (!r.ok) throw Error('Failed to fetch image count');
        let a = r.headers.get('x-total-count');
        return a ? parseInt(a, 10) : 1;
      }
      var F = r(4540);
      let R = F.d4;
      var W = r(2419);
      let q = (e) => {
          let { initialPage: t } = e,
            [r, i] = (0, s.useState)([]),
            [o, c] = (0, s.useState)({}),
            [d, u] = (0, s.useState)(!1),
            [h, p] = (0, s.useState)(null),
            [_, m] = l('searchTerm', ''),
            [x, g] = (0, s.useState)(1),
            [j, k] = (0, s.useState)(!1),
            [S, f] = (0, s.useState)(null),
            [b, w] = (0, s.useState)(''),
            N = (0, F.wA)(),
            y = R((e) => e.selection.selectedIds),
            C = (0, n.useRouter)(),
            P = (0, n.usePathname)(),
            I = (0, s.useCallback)(async () => {
              (u(!0), p(null));
              try {
                let e = _.trim(),
                  r = [],
                  a = new Map();
                (e ? await H(e) : await D()).forEach((e) => {
                  (r.push(e.id), a.set(e.id, e));
                });
                let [s, n] = await Promise.all([O(9, t - 1, r), A(r)]);
                return (
                  g(Math.max(1, Math.ceil(n / 9))),
                  s.map((e) => {
                    let t = a.get(r[0]);
                    return {
                      id: e.id,
                      imageId: e.id,
                      imageUrl: e.url,
                      title: (null == t ? void 0 : t.name) || 'Cat',
                      description:
                        (null == t ? void 0 : t.description) ||
                        'No description',
                      detailsUrl: '/details/'.concat(e.id),
                    };
                  })
                );
              } catch (t) {
                let e = t.message || 'Failed to fetch data';
                return (console.error(e), p(e), []);
              } finally {
                u(!1);
              }
            }, [_, t]);
          if (
            ((0, s.useEffect)(() => {
              let e = o[t];
              e
                ? i(e)
                : I().then((e) => {
                    (i(e), c((r) => ({ ...r, [t]: e })));
                  });
            }, [t, o, I]),
            (0, s.useEffect)(() => {
              if (!S) return;
              let e = document.createElement('a');
              ((e.href = S),
                (e.download = b),
                e.click(),
                URL.revokeObjectURL(S),
                f(null));
            }, [S, b]),
            j)
          )
            throw Error('Simulated error caught by ErrorBoundary');
          return (0, a.jsx)(s.Suspense, {
            children: (0, a.jsxs)('main', {
              className: U().main,
              children: [
                (0, a.jsx)(B, {
                  onSearch: (e) => {
                    (m(e), c({}), C.push('/?page=1'));
                  },
                  defaultValue: _,
                }),
                h &&
                  (0, a.jsx)('div', {
                    className: U().error,
                    role: 'alert',
                    children: h,
                  }),
                (0, a.jsx)('section', {
                  className: U().results,
                  children: (0, a.jsx)(v, {
                    items: r,
                    loading: d,
                    selectedIds: y,
                    onToggleSelect: (e) => N((0, W.N0)(e)),
                  }),
                }),
                !d &&
                  r.length > 0 &&
                  (0, a.jsx)(E, {
                    currentPage: t,
                    totalPages: x,
                    onPageChange: (e) => {
                      let t = new URLSearchParams();
                      (t.set('page', e.toString()),
                        C.push(''.concat(P, '?').concat(t.toString())));
                    },
                  }),
                y.length > 0 &&
                  (0, a.jsx)(T, {
                    selectedCount: y.length,
                    onClear: () => N((0, W.wr)()),
                    onDownload: () => {
                      let e = Object.values(o)
                          .flat()
                          .filter((e) => y.includes(e.id)),
                        t = new Blob(
                          [
                            [
                              ['Title', 'Description'],
                              ...e.map((e) => [e.title, e.description || '']),
                            ]
                              .map((e) =>
                                e
                                  .map((e) =>
                                    '"'.concat(e.replace(/"/g, '""'), '"')
                                  )
                                  .join(',')
                              )
                              .join('\n'),
                          ],
                          { type: 'text/csv;charset=utf-8;' }
                        ),
                        r = URL.createObjectURL(t);
                      (w(''.concat(e.length, '_cat_breeds.csv')), f(r));
                    },
                  }),
                (0, a.jsx)('div', {
                  className: U().errorButton,
                  children: (0, a.jsx)('button', {
                    onClick: () => k(!0),
                    className: U().throwButton,
                    children: 'Trigger error',
                  }),
                }),
              ],
            }),
          });
        },
        Y = () => {
          let e = (0, n.useSearchParams)(),
            t = null == e ? void 0 : e.get('page'),
            r = Math.max(parseInt(null != t ? t : '1', 10), 1);
          return (0, a.jsx)(s.Suspense, {
            fallback: (0, a.jsx)('div', { children: 'Loading Main Block...' }),
            children: (0, a.jsx)(q, { initialPage: r }),
          });
        };
    },
    5777: (e) => {
      e.exports = {
        main: 'MainBlock_main__PrGR9',
        loading: 'MainBlock_loading__VoIrx',
        error: 'MainBlock_error__LumH1',
        results: 'MainBlock_results__5nezq',
        throwButton: 'MainBlock_throwButton__8LLHu',
        split: 'MainBlock_split__yvGAq',
        list: 'MainBlock_list__e_xT_',
        detail: 'MainBlock_detail__Hu_Hy',
      };
    },
    5785: (e) => {
      e.exports = {
        selectionBar: 'SelectionBlock_selectionBar__7gXYn',
        pulse: 'SelectionBlock_pulse__rEITa',
      };
    },
    6205: (e) => {
      e.exports = { wrapper: 'CardListSkeleton_wrapper__d0oNt' };
    },
    6263: (e) => {
      e.exports = {
        search: 'Search_search__HDr34',
        input: 'Search_input__BZ4BT',
        button: 'Search_button__O3Leg',
        pulse: 'Search_pulse__HqGtx',
      };
    },
    8189: (e, t, r) => {
      'use strict';
      r.d(t, { default: () => o });
      var a = r(5155),
        s = r(2115),
        n = r(4861),
        l = r.n(n);
      class i extends s.Component {
        static getDerivedStateFromError(e) {
          return { hasError: !0, error: e };
        }
        componentDidCatch(e, t) {
          console.error('Error caught by ErrorBoundary:', e, t);
        }
        render() {
          if (this.state.hasError) {
            var e;
            let { reloadFn: t } = this.props;
            return (0, a.jsxs)('div', {
              className: l().errorBoundary,
              children: [
                (0, a.jsx)('h2', { children: 'Something went wrong.' }),
                (0, a.jsxs)('details', {
                  style: { whiteSpace: 'pre-wrap' },
                  children: [
                    (0, a.jsx)('summary', { children: 'Error:' }),
                    null == (e = this.state.error) ? void 0 : e.message,
                  ],
                }),
                (0, a.jsx)('button', {
                  onClick: () => (t ? t() : window.location.reload()),
                  className: l().reloadButton,
                  children: 'Try again',
                }),
              ],
            });
          }
          return this.props.children;
        }
        constructor(...e) {
          (super(...e), (this.state = { hasError: !1, error: null }));
        }
      }
      let o = i;
    },
    8493: (e, t, r) => {
      (Promise.resolve().then(r.bind(r, 8189)),
        Promise.resolve().then(r.bind(r, 5064)));
    },
    9981: (e) => {
      e.exports = {
        skeleton: 'CardSkeleton_skeleton__kEOAU',
        pulse: 'CardSkeleton_pulse__n2xtt',
        imageSkeleton: 'CardSkeleton_imageSkeleton__udv_t',
        textSkeleton: 'CardSkeleton_textSkeleton__A_IZr',
      };
    },
  },
  (e) => {
    (e.O(0, [62, 874, 745, 441, 964, 358], () => e((e.s = 8493))),
      (_N_E = e.O()));
  },
]);
