import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import * as settingsService from '../services/settingsService';
import { RATIO_OPTIONS, DURATION_OPTIONS, MODEL_OPTIONS, type JimengSessionAccount } from '../types/index';
import { PlusIcon, SparkleIcon, CheckIcon } from '../components/Icons';

export default function SettingsPage() {
  const { state, updateSettingsAction } = useApp();
  const { settings } = state;

  const [localSettings, setLocalSettings] = useState({
    model: settings.model || 'seedance-2.0-fast',
    ratio: settings.ratio || '16:9',
    duration: settings.duration || '5',
    reference_mode: settings.reference_mode || '全能参考',
    download_path: settings.download_path || '',
    max_concurrent: settings.max_concurrent || '5',
    min_interval: settings.min_interval || '30000',
    max_interval: settings.max_interval || '50000',
  });

  // Session ID 账号管理
  const [sessionAccounts, setSessionAccounts] = useState<JimengSessionAccount[]>([]);
  const [newAccount, setNewAccount] = useState({ name: '', sessionId: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingAccount, setEditingAccount] = useState({ name: '', sessionId: '' });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [testTargetId, setTestTargetId] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // 加载 Session ID 账号列表
  const loadSessionAccounts = async () => {
    try {
      const data = await settingsService.getSessionAccounts();
      setSessionAccounts(data.accounts || []);
    } catch (error) {
      console.error('加载 SessionID 列表失败:', error);
    }
  };

  useEffect(() => {
    loadSessionAccounts();
  }, []);

  // 保存设置
  const handleSave = async () => {
    try {
      await updateSettingsAction(localSettings);
      setHasChanges(false);
      alert('设置已保存');
    } catch (error) {
      alert(`保存失败：${error instanceof Error ? error.message : error}`);
    }
  };

  // 添加 Session ID 账号
  const handleAddAccount = async () => {
    if (!newAccount.sessionId) {
      alert('请输入 SessionID');
      return;
    }

    try {
      const account = await settingsService.createSessionAccount({
        name: newAccount.name || `账号 ${sessionAccounts.length + 1}`,
        sessionId: newAccount.sessionId,
      });
      setSessionAccounts([...sessionAccounts, account]);
      setNewAccount({ name: '', sessionId: '' });
      alert('添加成功');
    } catch (error) {
      alert(`添加失败：${error instanceof Error ? error.message : error}`);
    }
  };

  // 删除 Session ID 账号
  const handleDeleteAccount = async (id: number) => {
    if (!confirm('确定要删除此 SessionID 账号吗？')) return;

    try {
      await settingsService.deleteSessionAccount(id);
      setSessionAccounts(sessionAccounts.filter((a) => a.id !== id));
      alert('删除成功');
    } catch (error) {
      alert(`删除失败：${error instanceof Error ? error.message : error}`);
    }
  };

  // 设为默认账号
  const handleSetDefault = async (id: number) => {
    try {
      await settingsService.setDefaultSessionAccount(id);
      setSessionAccounts(
        sessionAccounts.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
      alert('已设为默认账号');
    } catch (error) {
      alert(`设置失败：${error instanceof Error ? error.message : error}`);
    }
  };

  // 开始编辑
  const startEditing = (account: JimengSessionAccount) => {
    setEditingId(account.id);
    setEditingAccount({ name: account.name, sessionId: account.sessionId });
  };

  // 保存编辑
  const handleSaveEdit = async (id: number) => {
    try {
      await settingsService.updateSessionAccount(id, editingAccount);
      setSessionAccounts(
        sessionAccounts.map((a) =>
          a.id === id ? { ...a, name: editingAccount.name, sessionId: editingAccount.sessionId } : a
        )
      );
      setEditingId(null);
      setEditingAccount({ name: '', sessionId: '' });
      alert('更新成功');
    } catch (error) {
      alert(`更新失败：${error instanceof Error ? error.message : error}`);
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditingAccount({ name: '', sessionId: '' });
  };

  // 测试 SessionID
  const handleTestSession = async (sessionId: string, id: number | null = null) => {
    if (!sessionId) {
      alert('请先输入 SessionID');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setTestTargetId(id);

    try {
      const result = await settingsService.testJimengSessionId(sessionId);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : '测试失败',
      });
    } finally {
      setIsTesting(false);
    }
  };

  // 检查是否有改动
  useEffect(() => {
    const hasChanges =
      localSettings.model !== settings.model ||
      localSettings.ratio !== settings.ratio ||
      localSettings.duration !== settings.duration ||
      localSettings.reference_mode !== settings.reference_mode ||
      localSettings.download_path !== settings.download_path ||
      localSettings.max_concurrent !== settings.max_concurrent ||
      localSettings.min_interval !== settings.min_interval ||
      localSettings.max_interval !== settings.max_interval;
    setHasChanges(hasChanges);
  }, [localSettings, settings]);

  const defaultAccount = sessionAccounts.find((a) => a.isDefault);

  return (
    <div className="h-screen overflow-y-auto bg-[#0f111a] text-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">全局设置</h1>

        {/* SessionID 账号管理 - 移到最前面 */}
        <div className="bg-[#1c1f2e] rounded-xl p-6 mb-6 border border-gray-800">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <SparkleIcon className="w-5 h-5 text-purple-400" />
            SessionID 账号管理
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            添加您的即梦 SessionID 账号，支持多账号切换。默认账号将用于视频生成。
          </p>

          {/* 当前默认账号提示 */}
          {defaultAccount && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                当前默认账号：<strong>{defaultAccount.name || '未命名'}</strong>
                <span className="text-gray-500 ml-2">({defaultAccount.sessionId.slice(0, 8)}...{defaultAccount.sessionId.slice(-8)})</span>
              </span>
            </div>
          )}

          {/* 添加新账号 */}
          <div className="mb-4 p-4 bg-[#0f111a] rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-3">添加新账号</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                placeholder="账号名称（可选）"
                className="bg-[#1c1f2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                value={newAccount.sessionId}
                onChange={(e) => setNewAccount({ ...newAccount, sessionId: e.target.value })}
                placeholder="SessionID（从即梦 Cookie 获取）"
                className="bg-[#1c1f2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 md:col-span-1"
              />
              <button
                onClick={handleAddAccount}
                disabled={!newAccount.sessionId}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 rounded-lg transition-all font-medium"
              >
                <PlusIcon className="w-4 h-4" />
                添加
              </button>
            </div>
          </div>

          {/* 账号列表 */}
          {sessionAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>暂无 SessionID 账号</p>
              <p className="text-xs mt-1">访问 https://jimeng.jianying.com 后，从开发者工具 → Application → Cookies 获取 sessionid</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessionAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-4 rounded-lg border transition-all ${
                    account.isDefault
                      ? 'bg-purple-500/10 border-purple-500/50'
                      : 'bg-[#0f111a] border-gray-700'
                  }`}
                >
                  {editingId === account.id ? (
                    // 编辑模式
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={editingAccount.name}
                          onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                          placeholder="账号名称"
                          className="bg-[#1c1f2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={editingAccount.sessionId}
                          onChange={(e) => setEditingAccount({ ...editingAccount, sessionId: e.target.value })}
                          placeholder="SessionID"
                          className="bg-[#1c1f2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(account.id)}
                            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors"
                          >
                            保存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 显示模式
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-200">
                            {account.name || '未命名'}
                          </span>
                          {account.isDefault && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                              默认
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {account.sessionId.slice(0, 16)}...{account.sessionId.slice(-8)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleTestSession(account.sessionId, account.id)}
                          disabled={isTesting && testTargetId === account.id}
                          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded text-xs font-medium transition-colors"
                        >
                          {isTesting && testTargetId === account.id ? '测试中...' : '测试'}
                        </button>
                        {!account.isDefault && (
                          <button
                            onClick={() => handleSetDefault(account.id)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-xs font-medium transition-colors"
                          >
                            设为默认
                          </button>
                        )}
                        <button
                          onClick={() => startEditing(account)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium transition-colors"
                        >
                          编辑
                        </button>
                        {!account.isDefault && (
                          <button
                            onClick={() => handleDeleteAccount(account.id)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-xs font-medium transition-colors"
                          >
                            删除
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 测试结果 */}
                  {testTargetId === account.id && testResult && (
                    <div
                      className={`mt-3 p-2 rounded text-sm ${
                        testResult.success
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {testResult.success
                        ? `✓ ${testResult.message || 'SessionID 有效'}`
                        : `✗ ${testResult.error || 'SessionID 无效'}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 模型设置 */}
        <div className="bg-[#1c1f2e] rounded-xl p-6 mb-6 border border-gray-800">
          <h2 className="text-lg font-bold mb-4">模型设置</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                选择模型
              </label>
              <div className="space-y-2">
                {MODEL_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setLocalSettings((prev) => ({ ...prev, model: option.value }))
                    }
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      localSettings.model === option.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 bg-[#161824] hover:border-gray-600'
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        localSettings.model === option.value
                          ? 'text-purple-400'
                          : 'text-gray-300'
                      }`}
                    >
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                参考模式
              </label>
              <div className="flex gap-2">
                {['全能参考', '首帧参考', '尾帧参考'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() =>
                      setLocalSettings((prev) => ({ ...prev, reference_mode: mode }))
                    }
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      localSettings.reference_mode === mode
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-700 bg-[#161824] text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                画面比例
              </label>
              <div className="grid grid-cols-6 gap-2">
                {RATIO_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setLocalSettings((prev) => ({ ...prev, ratio: opt.value }))
                    }
                    className={`flex flex-col items-center gap-1.5 py-2 rounded-lg border transition-all ${
                      localSettings.ratio === opt.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 bg-[#161824] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8">
                      <div
                        className={`rounded-sm border ${
                          localSettings.ratio === opt.value
                            ? 'border-purple-400'
                            : 'border-gray-500'
                        }`}
                        style={{
                          width: `${(opt.widthRatio / Math.max(opt.widthRatio, opt.heightRatio)) * 24}px`,
                          height: `${(opt.heightRatio / Math.max(opt.widthRatio, opt.heightRatio)) * 24}px`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-[11px] ${
                        localSettings.ratio === opt.value
                          ? 'text-purple-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                视频时长 (秒)
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        duration: String(d),
                      }))
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      localSettings.duration === String(d)
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-700 bg-[#161824] text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {d}秒
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 批量生成设置 */}
        <div className="bg-[#1c1f2e] rounded-xl p-6 mb-6 border border-gray-800">
          <h2 className="text-lg font-bold mb-4">批量生成设置</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                最大并发数
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={localSettings.max_concurrent}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    max_concurrent: e.target.value,
                  }))
                }
                className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                最小间隔 (毫秒)
              </label>
              <input
                type="number"
                min="10000"
                max="60000"
                step="1000"
                value={localSettings.min_interval}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    min_interval: e.target.value,
                  }))
                }
                className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                最大间隔 (毫秒)
              </label>
              <input
                type="number"
                min="30000"
                max="120000"
                step="1000"
                value={localSettings.max_interval}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    max_interval: e.target.value,
                  }))
                }
                className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* 下载路径设置 */}
        <div className="bg-[#1c1f2e] rounded-xl p-6 mb-6 border border-gray-800">
          <h2 className="text-lg font-bold mb-4">下载路径设置</h2>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              视频保存路径
            </label>
            <input
              type="text"
              value={localSettings.download_path}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  download_path: e.target.value,
                }))
              }
              placeholder="留空则使用默认路径：~/Videos/Seedance"
              className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              生成的视频将自动保存到此目录下的对应项目文件夹中
            </p>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end gap-3 sticky bottom-0 bg-[#0f111a] py-4 border-t border-gray-800 -mx-6 px-6">
          <button
            onClick={() =>
              setLocalSettings({
                model: settings.model || 'seedance-2.0-fast',
                ratio: settings.ratio || '16:9',
                duration: settings.duration || '5',
                reference_mode: settings.reference_mode || '全能参考',
                download_path: settings.download_path || '',
                max_concurrent: settings.max_concurrent || '5',
                min_interval: settings.min_interval || '30000',
                max_interval: settings.max_interval || '50000',
              })
            }
            className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
          >
            重置
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 rounded-lg transition-all font-medium shadow-lg shadow-purple-900/20"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
