'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Msg, useLoad } from '@/components/ui';

export default function Utilizadores() {
  const [role, setRole] = useState('VENDEDOR');
  const { data, error, reload } = useLoad(() => api(`/admin/users?role=${role}`), [role]);
  const [msg, setMsg] = useState({});
  const toggle = async (u) => { setMsg({}); try { await api(`/admin/users/${u.id}`, { method: 'PATCH', body: { ativo: !u.ativo } }); reload(); } catch (e) { setMsg({ error: e.message }); } };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-extrabold">Utilizadores</h1>
        <select className="input w-44" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Tipo de utilizador"><option value="VENDEDOR">Vendedores</option><option value="COMPRADOR">Compradores</option><option value="ADMIN">Administradores</option></select></div>
      <Msg {...msg} /><Msg error={error} />
      <div className="overflow-x-auto rounded-lg border border-line bg-white"><table className="w-full min-w-[720px]">
        <thead className="bg-paper"><tr><th className="th">Nome</th><th className="th">Matrícula</th><th className="th">Contacto</th><th className="th">Curso</th><th className="th">Produtos</th><th className="th">Conta</th></tr></thead>
        <tbody className="divide-y divide-line">{data?.map((u) => (
          <tr key={u.id}><td className="td font-semibold">{u.nomeCompleto}</td><td className="td">{u.matricula}</td><td className="td">+{u.telefone}{!u.telefoneVerificado && <p className="text-xs text-amber-700">Não verificado</p>}</td><td className="td">{u.curso.nome}</td><td className="td">{u._count.produtos}</td>
            <td className="td"><button className={u.ativo ? 'btn-ghost !px-2 !py-1 !text-red-700' : 'btn-primary !px-2 !py-1'} onClick={() => toggle(u)}>{u.ativo ? 'Desativar' : 'Ativar'}</button></td></tr>))}</tbody>
      </table>{data?.length === 0 && <p className="p-4 text-sm text-slate-600">Sem utilizadores neste grupo.</p>}</div>
    </div>
  );
}
