import { useContext, useState } from 'react'
import {
  Button,
  Input,
  Select,
  Modal,
  message,
  Popconfirm,
  Space,
  Form,
  Tabs,
  Collapse,
  Tooltip,
  Segmented,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AimOutlined,
  SaveOutlined,
  ReloadOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { MapContext } from '../MapWapper'
import { NavContext } from '../../App'
import DraggablePanel from './DraggablePanel'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createShop,
  updateShop,
  deleteShop,
  login,
  logout,
  hasToken,
} from '../../config/mapApi'
import Style from './MapEditor.module.css'

// 按 layout_col 分列, 列内按 sort_order 排
const buildColumns = (cats) => {
  const byCol = {}
  cats.forEach((c) => {
    const k = c.layout_col ?? 0
    if (!byCol[k]) byCol[k] = []
    byCol[k].push(c)
  })
  return Object.keys(byCol)
    .map(Number)
    .sort((a, b) => a - b)
    .map((k) => ({
      col: k,
      items: byCol[k]
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    }))
}

const MapEditor = () => {
  const {
    currentFloorConfig,
    handleClickShop,
    clickShopItem,
    showAllBrands,
    showLabelsOnMap,
    toggleShowAllBrands,
    toggleLabelsOnMap,
  } = useContext(MapContext)
  const { floor, reloadMapData } = useContext(NavContext)

  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [catModal, setCatModal] = useState(null)
  const [shopModal, setShopModal] = useState(null)
  // 登录态
  const [authed, setAuthed] = useState(hasToken())
  const [loginForm, setLoginForm] = useState({ username: 'tsja', password: '' })
  const [loggingIn, setLoggingIn] = useState(false)

  const doLogin = async () => {
    if (!loginForm.password) return message.warning('请输入密码')
    setLoggingIn(true)
    try {
      await login(loginForm.username.trim(), loginForm.password)
      setAuthed(true)
      setLoginForm({ ...loginForm, password: '' })
      message.success('登录成功')
    } catch (e) {
      message.error(e.message || '登录失败')
    } finally {
      setLoggingIn(false)
    }
  }
  const doLogout = () => {
    logout()
    setAuthed(false)
  }

  const categories = currentFloorConfig || []
  const catOptions = categories.map((c) => ({ label: c.type, value: c.id }))
  const maxCol = categories.reduce((m, c) => Math.max(m, c.layout_col ?? 0), 0)

  // 执行接口操作 -> 刷新 -> 提示
  const run = async (fn, okMsg) => {
    setBusy(true)
    try {
      await fn()
      await reloadMapData()
      if (okMsg) message.success(okMsg)
      return true
    } catch (e) {
      message.error(e.message || '操作失败')
      if (/登录/.test(e.message || '')) setAuthed(false) // token 失效 -> 回到登录
      return false
    } finally {
      setBusy(false)
    }
  }

  const findShop = (id) => {
    for (const c of categories)
      for (const s of c.content || []) if (s.id === id) return s
    return null
  }

  // ---------- 品类增删改 ----------
  const submitCat = async () => {
    const { mode, id, type, color } = catModal
    if (!type?.trim()) return message.warning('请填写品类名称')
    const ok = await run(
      () =>
        mode === 'create'
          ? createCategory({
              floor,
              type: type.trim(),
              color: color || null,
              layout_col: maxCol + 1, // 新品类放到最右新列, 保证立即可见
            })
          : updateCategory(id, { type: type.trim(), color: color || null }),
      mode === 'create' ? '已新增品类' : '已更新品类',
    )
    if (ok) setCatModal(null)
  }

  // ---------- 商户增删改 ----------
  const submitShop = async () => {
    const { mode, id, categoryId, name, num } = shopModal
    if (!name?.trim()) return message.warning('请填写商户名称')
    const ok = await run(
      () =>
        mode === 'create'
          ? createShop({
              category_id: categoryId,
              name: name.trim(),
              num: num?.trim() || null,
              position: [],
            })
          : updateShop(id, {
              category_id: categoryId,
              name: name.trim(),
              num: num?.trim() || null,
            }),
      mode === 'create' ? '已新增商户' : '已更新商户',
    )
    if (ok) setShopModal(null)
  }

  const saveShopPosition = (shop) =>
    run(
      () => updateShop(shop.id, { position: findShop(shop.id)?.position || [] }),
      '位置已保存',
    )
  const clearShopPosition = (shop) =>
    run(() => updateShop(shop.id, { position: [] }), '已清除位置')

  // ---------- 版面操作 ----------
  const nextSort = (col) => {
    const items = categories.filter((c) => (c.layout_col ?? 0) === col)
    return items.length
      ? Math.max(...items.map((c) => c.sort_order ?? 0)) + 1
      : 0
  }
  const moveCol = (cat, delta) => {
    const target = Math.max(0, (cat.layout_col ?? 0) + delta)
    if (target === (cat.layout_col ?? 0)) return
    run(
      () =>
        updateCategory(cat.id, {
          layout_col: target,
          sort_order: nextSort(target),
        }),
      '已移动',
    )
  }
  const moveSort = (cat, dir) => {
    const items = categories
      .filter((c) => (c.layout_col ?? 0) === (cat.layout_col ?? 0))
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    const idx = items.findIndex((c) => c.id === cat.id)
    const j = idx + dir
    if (j < 0 || j >= items.length) return
    const other = items[j]
    run(async () => {
      await updateCategory(cat.id, { sort_order: other.sort_order ?? 0 })
      await updateCategory(other.id, { sort_order: cat.sort_order ?? 0 })
    }, '已调整顺序')
  }
  const setWidth = (cat, w) =>
    run(() => updateCategory(cat.id, { width_cols: w }), '已调整宽度')

  // ---------- 商户 tab ----------
  const shopTab = (
    <>
      <div className={Style.tabBar}>
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => reloadMapData()}
          loading={busy}
        >
          刷新
        </Button>
        <Button
          size="small"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCatModal({ mode: 'create', type: '', color: '#88ABAA' })}
        >
          新增品类
        </Button>
      </div>
      <Collapse
        items={categories.map((cat) => ({
          key: String(cat.id),
          label: (
            <Space>
              <span
                className={Style.swatch}
                style={{ background: cat.color || '#ccc' }}
              />
              <span>{cat.type}</span>
              <span className={Style.count}>{cat.content?.length || 0}</span>
            </Space>
          ),
          extra: (
            <Space onClick={(e) => e.stopPropagation()}>
              <EditOutlined
                onClick={() =>
                  setCatModal({
                    mode: 'edit',
                    id: cat.id,
                    type: cat.type,
                    color: cat.color,
                  })
                }
              />
              <Popconfirm
                title="删除该品类及其下所有商户?"
                onConfirm={() => run(() => deleteCategory(cat.id), '已删除品类')}
              >
                <DeleteOutlined />
              </Popconfirm>
            </Space>
          ),
          children: (
            <div>
              {(cat.content || []).map((shop) => {
                const selected = clickShopItem?.id === shop.id
                const posCount = shop.position?.length || 0
                return (
                  <div
                    key={shop.id}
                    className={`${Style.shopRow} ${selected ? Style.selected : ''}`}
                  >
                    <div className={Style.shopInfo}>
                      <div className={Style.shopName}>{shop.name}</div>
                      <div className={Style.shopMeta}>
                        {shop.num ? <span>{shop.num}</span> : null}
                        <span>{posCount ? `${posCount}个坐标` : '未设位置'}</span>
                      </div>
                    </div>
                    <Space size={4}>
                      <Tooltip title="选中后点地图设置位置">
                        <Button
                          size="small"
                          type={selected ? 'primary' : 'default'}
                          icon={<AimOutlined />}
                          onClick={() => handleClickShop(shop, cat)}
                        />
                      </Tooltip>
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() =>
                          setShopModal({
                            mode: 'edit',
                            id: shop.id,
                            categoryId: cat.id,
                            name: shop.name,
                            num: shop.num,
                          })
                        }
                      />
                      <Popconfirm
                        title="确定撤场删除该商户?"
                        onConfirm={() =>
                          run(() => deleteShop(shop.id), '已删除商户')
                        }
                      >
                        <Button size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                    {selected && (
                      <div className={Style.posActions}>
                        <span className={Style.hint}>点地图加坐标 →</span>
                        <Button
                          size="small"
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={() => saveShopPosition(shop)}
                        >
                          保存位置
                        </Button>
                        <Button size="small" onClick={() => clearShopPosition(shop)}>
                          清除
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
              <Button
                block
                type="dashed"
                icon={<PlusOutlined />}
                style={{ marginTop: 8 }}
                onClick={() =>
                  setShopModal({
                    mode: 'create',
                    categoryId: cat.id,
                    name: '',
                    num: '',
                  })
                }
              >
                新增商户
              </Button>
            </div>
          ),
        }))}
      />
    </>
  )

  // ---------- 版面 tab ----------
  const columns = buildColumns(categories)
  const layoutTab = (
    <>
      <div className={Style.layoutTip}>
        每一列对应屏幕上的一列。用 ← → 把品类移到相邻列，↑ ↓ 调整列内上下顺序，
        宽度切 1/2 列。新增品类默认在最右新列。
      </div>
      <div className={Style.layoutCols}>
        {columns.map(({ col, items }) => (
          <div key={col} className={Style.layoutCol}>
            <div className={Style.layoutColHead}>第 {col + 1} 列</div>
            {items.map((cat) => (
              <div key={cat.id} className={Style.layoutCard}>
                <div className={Style.layoutCardTop}>
                  <span
                    className={Style.swatch}
                    style={{ background: cat.color || '#ccc' }}
                  />
                  <span className={Style.layoutName}>{cat.type}</span>
                  <span className={Style.count}>{cat.content?.length || 0}</span>
                </div>
                <div className={Style.layoutBtns}>
                  <Button
                    size="small"
                    icon={<LeftOutlined />}
                    disabled={busy || (cat.layout_col ?? 0) === 0}
                    onClick={() => moveCol(cat, -1)}
                  />
                  <Button
                    size="small"
                    icon={<RightOutlined />}
                    disabled={busy}
                    onClick={() => moveCol(cat, 1)}
                  />
                  <Button
                    size="small"
                    icon={<UpOutlined />}
                    disabled={busy}
                    onClick={() => moveSort(cat, -1)}
                  />
                  <Button
                    size="small"
                    icon={<DownOutlined />}
                    disabled={busy}
                    onClick={() => moveSort(cat, 1)}
                  />
                  <Segmented
                    size="small"
                    value={cat.width_cols || 1}
                    options={[
                      { label: '1列', value: 1 },
                      { label: '2列', value: 2 },
                    ]}
                    onChange={(v) => setWidth(cat, v)}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )

  return (
    <>
      <Button
        className={Style.toggleBtn}
        type="primary"
        onClick={() => setOpen(true)}
      >
        📋 数据管理
      </Button>
      {open && (
        <DraggablePanel
          title={`${floor} 数据管理`}
          width={430}
          onClose={() => setOpen(false)}
        >
          {!authed ? (
            <div className={Style.loginBox}>
              <div className={Style.loginTitle}>请先登录后再编辑数据</div>
              <Input
                placeholder="用户名"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                style={{ marginBottom: 8 }}
              />
              <Input.Password
                placeholder="密码"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                onPressEnter={doLogin}
                style={{ marginBottom: 12 }}
              />
              <Button type="primary" block loading={loggingIn} onClick={doLogin}>
                登录
              </Button>
            </div>
          ) : (
            <>
              <div className={Style.toolRow}>
                <Button
                  size="small"
                  type={showAllBrands ? 'primary' : 'default'}
                  onClick={toggleShowAllBrands}
                >
                  {showAllBrands ? '隐藏所有位置' : '显示所有位置'}
                </Button>
                <Button
                  size="small"
                  type={showLabelsOnMap ? 'primary' : 'default'}
                  onClick={toggleLabelsOnMap}
                >
                  {showLabelsOnMap ? '隐藏名称' : '显示名称'}
                </Button>
                <Button
                  size="small"
                  className={Style.logoutBtn}
                  onClick={doLogout}
                >
                  退出登录
                </Button>
              </div>
              <Tabs
                items={[
                  { key: 'shop', label: '商户', children: shopTab },
                  { key: 'layout', label: '版面布局', children: layoutTab },
                ]}
              />
            </>
          )}
        </DraggablePanel>
      )}

      {/* 品类弹窗 */}
      <Modal
        title={catModal?.mode === 'create' ? '新增品类' : '编辑品类'}
        open={!!catModal}
        onOk={submitCat}
        confirmLoading={busy}
        onCancel={() => setCatModal(null)}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="品类名称">
            <Input
              value={catModal?.type}
              onChange={(e) => setCatModal({ ...catModal, type: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="颜色">
            <Input
              type="color"
              value={catModal?.color || '#88ABAA'}
              onChange={(e) =>
                setCatModal({ ...catModal, color: e.target.value })
              }
              style={{ width: 60, padding: 2 }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 商户弹窗 */}
      <Modal
        title={shopModal?.mode === 'create' ? '新增商户' : '编辑商户'}
        open={!!shopModal}
        onOk={submitShop}
        confirmLoading={busy}
        onCancel={() => setShopModal(null)}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="商户名称" required>
            <Input
              value={shopModal?.name}
              onChange={(e) =>
                setShopModal({ ...shopModal, name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="铺位号(可空)">
            <Input
              value={shopModal?.num}
              onChange={(e) =>
                setShopModal({ ...shopModal, num: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="所属品类">
            <Select
              value={shopModal?.categoryId}
              options={catOptions}
              onChange={(v) => setShopModal({ ...shopModal, categoryId: v })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default MapEditor
