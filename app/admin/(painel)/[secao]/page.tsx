import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { SECTIONS, isSectionKey } from "@/lib/sections";
import { deleteItem, moveItem } from "../../section-actions";
import ItemForm from "./ItemForm";
import ConfirmButton from "./ConfirmButton";

export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function SectionPage({ params }: { params: Promise<{ secao: string }> }) {
  const { secao } = await params;
  if (!isSectionKey(secao)) notFound();
  await requireAdmin();

  const cfg = SECTIONS[secao];
  const delegate = (prisma as unknown as Record<string, any>)[cfg.model];
  const items: Record<string, any>[] = await delegate.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  const fields = cfg.fields as any[];

  return (
    <>
      <h1 className="admin-title">{cfg.title}</h1>
      <p className="admin-sub">{cfg.intro} Use as setas para mudar a ordem no site.</p>

      <details className="panel-card new-item">
        <summary>+ Adicionar {cfg.singular}</summary>
        <ItemForm secao={secao} fields={fields} />
      </details>

      {items.length === 0 && <p className="admin-sub">Ainda não há itens nesta secção.</p>}

      <ul className="item-list">
        {items.map((item, index) => (
          <li className="item-card" key={item.id}>
            <div className="item-head">
              <div className="item-title">
                {"iconField" in cfg && cfg.iconField && <i className={`fas ${item[cfg.iconField]}`} />}
                <div>
                  <strong>{item[cfg.titleField]}</strong>
                  {"subField" in cfg && cfg.subField && <small>{item[cfg.subField]}</small>}
                </div>
              </div>

              <div className="item-actions">
                <form action={moveItem}>
                  <input type="hidden" name="secao" value={secao} />
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="dir" value="up" />
                  <button className="icon-btn" disabled={index === 0} aria-label="Subir" title="Subir">↑</button>
                </form>
                <form action={moveItem}>
                  <input type="hidden" name="secao" value={secao} />
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="dir" value="down" />
                  <button className="icon-btn" disabled={index === items.length - 1} aria-label="Descer" title="Descer">↓</button>
                </form>
                <form action={deleteItem}>
                  <input type="hidden" name="secao" value={secao} />
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmButton className="icon-btn danger" message="Apagar este item? Esta acção não pode ser desfeita.">
                    Apagar
                  </ConfirmButton>
                </form>
              </div>
            </div>

            <details>
              <summary>Editar</summary>
              <ItemForm secao={secao} fields={fields} item={item} />
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}
