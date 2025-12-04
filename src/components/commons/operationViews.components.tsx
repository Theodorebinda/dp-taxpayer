import React, { useState } from "react";
import { InnerAgentData, InnerPossession } from "@/types/operation-view.type";
import ImageWithFallback from "../table/components/table-image";
import { TextCopy } from "../atoms/textCopy";
import SimpleTable from "../table/simple-table";
import {
  MessageSquare,
  Reply,
  MoreVertical,
  Bold,
  Italic,
  Link2,
  Send,
  Mail,
  UserCircle,
} from "lucide-react";

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`p-5 lg:p-8 bg-background rounded-md ${className}`}>
      {children}
    </div>
  );
};
export const CardHeader = (props: React.ComponentProps<"div">) => (
  <div className="flex flex-col space-y-1.5 p-6" {...props} />
);
export const CardTitle = (props: React.ComponentProps<"h3">) => (
  <h3 className="font-semibold leading-none tracking-tight" {...props} />
);
export const CardContent = (props: React.ComponentProps<"div">) => (
  <div className="p-6 pt-0" {...props} />
);

export const QuickStats = ({
  title,
  value = "",
  unit,
  valueAsEnum,
  valueColor = "",
  className,
}: {
  title: string;
  value: string | number;
  unit?: string;
  valueColor?: string;
  valueAsEnum?: { value: string | number; color?: string; label: string }[];
  className?: string;
}) => {
  let reviewdValue = value;
  if (valueAsEnum) {
    const enumValue = valueAsEnum.find((v) => v.value === value);
    if (enumValue) {
      reviewdValue = enumValue.label;
      valueColor = enumValue.color || "";
    }
  }
  return (
    <div
      className={`p-5 bg-background rounded-md flex flex-col gap-3 w-full" + ${className}`}
    >
      <span>{title}</span>
      <span>
        <span className={`text-xl font-semibold ${valueColor}`}>
          {reviewdValue}
        </span>{" "}
        {unit}
      </span>
    </div>
  );
};

export const AgentCard = (props: InnerAgentData) => {
  return (
    <div className="flex gap-5 items-center max-lg:flex-col">
      <div className="rounded-xl overflow-hidden border-primary border-2 max-lg:w-full max-lg:h-auto">
        {props.photo && props.photo !== null ? (
          <ImageWithFallback
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${
              props.photo[1] == "/" ? "" : "/"
            }${props.photo}`}
            alt="agent images"
            className="max-lg:w-full max-lg:h-auto"
            width={30}
            height={30}
          />
        ) : (
          <UserCircle size={30} className="m-2.5" />
        )}
      </div>
      <ul>
        <li className="font-semibold">
          {props.firstName} {props.lastName}
        </li>
        {/* <li className="flex items-center gap-2">
          <Phone size={15} /> {props.mobile}
        </li> */}
        <li className="flex items-center gap-2">
          <Mail size={15} /> {props.mail}
        </li>
      </ul>
    </div>
  );
};

const TaxpayerInfo = ({ title, value }: { title: string; value: string }) => (
  <span className="flex gap-2 items-center w-full">
    <span className="whitespace-nowrap">{title}</span>
    <span className="font-normal">{value || "...."}</span>
  </span>
);
export const PossessionCard = (props: InnerPossession) => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold">Possession</h2>
      <div className="w-full overflow-hidden flex justify-between flex-wrap gap-5">
        <span className="flex flex-col gap-2">
          <span className="font-normal">Numéro unique :</span>
          <TextCopy>{props.uniqueNumber}</TextCopy>
        </span>
        <span className="flex flex-col gap-2">
          <span className="font-normal">Type :</span>
          <span className="font-bold text-green-600">{props.type?.name}</span>
        </span>
      </div>
      {Object.keys(props?.additionnalData || {}).length > 0 && (
        <>
          <span className="font-normal">Information additionnelle : </span>
          <div className="w-full overflow-x-auto">
            <SimpleTable
              columns={Object.keys(props.additionnalData).map((key) => ({
                key,
                label: key,
              }))}
              data={[props.additionnalData]}
            />
          </div>
        </>
      )}

      <span className="font-semibold">Contribuable (Detenteur)</span>
      {props.taxPayer ? (
        <>
          <TaxpayerInfo
            title="Nom complet :"
            value={`${props.taxPayer.firstName} ${
              props.taxPayer?.middleName || ""
            } ${props.taxPayer.lastName}`}
          />
          <TaxpayerInfo
            title="Numéro de télèphone :"
            value={props.taxPayer.mobile}
          />
          <TaxpayerInfo title="Adresse mail :" value={props.taxPayer.email} />
        </>
      ) : (
        <span>...</span>
      )}
    </div>
  );
};

type Comment = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies: Comment[];
};

export default function DocumentComments() {
  const [comments, setComments] = useState<Comment[]>([
    // {
    //   id: "1",
    //   author: "Sophie Dubois",
    //   avatar: "SD",
    //   content:
    //     "Excellente analyse sur la partie financière. Pourriez-vous préciser les projections pour Q2 ?",
    //   timestamp: "2 h",
    //   replies: [
    //     {
    //       id: "2",
    //       author: "Marc Laurent",
    //       avatar: "ML",
    //       content:
    //         "Tout à fait. Je vais ajouter un tableau détaillé avec les prévisions Q2 et Q3.",
    //       timestamp: "1 h",
    //       replies: [],
    //     },
    //   ],
    // },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [formatting, setFormatting] = useState({ bold: false, italic: false });

  // 🔧 Fonction récursive pour ajouter une réponse où qu'elle soit
  const addReply = (
    list: Comment[],
    parentId: string,
    reply: Comment
  ): Comment[] =>
    list.map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [...c.replies, reply] };
      }
      if (c.replies.length > 0) {
        return { ...c, replies: addReply(c.replies, parentId, reply) };
      }
      return c;
    });

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const newEntry: Comment = {
      id: Date.now().toString(),
      author: "Vous",
      avatar: "YO",
      content: newComment,
      timestamp: "À l’instant",
      replies: [],
    };

    if (replyingTo) {
      setComments((prev) => addReply(prev, replyingTo, newEntry));
      setReplyingTo(null);
    } else {
      setComments((prev) => [...prev, newEntry]);
    }

    setNewComment("");
    setFormatting({ bold: false, italic: false });
  };

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => (
    <div className="flex gap-3" style={{ paddingLeft: `${depth}px` }}>
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center font-semibold">
          {comment.avatar}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="bg-background border border-foreground/10 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-5">
              <h4 className="font-semibold text-foreground">
                {comment.author}
              </h4>
              <span className="text-foreground/70 text-sm">
                {comment.timestamp}
              </span>
            </div>
            <button className="text-foreground/40 hover:text-foreground/70 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <p className="text-foreground/80 leading-relaxed">
            {comment.content}
          </p>

          <button
            onClick={() => setReplyingTo(comment.id)}
            className="flex items-center gap-1.5 mt-3 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Reply className="w-4 h-4" />
            Répondre
          </button>
        </div>

        {comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="bg-background rounded-xl shadow-sm border border-foreground/10 overflow-hidden">
        <div className="border-b border-foreground/10 p-6 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground flex-1">
            Discussions pour cette étape
          </h2>
          <span className="text-foreground/70">
            {comments.length} commentaires
          </span>
        </div>

        <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>

        <div className="border-t border-foreground/10 p-4 bg-background">
          {replyingTo && (
            <div className="mb-3 flex items-center gap-2 text-foreground/60">
              <Reply className="w-4 h-4" />
              <span>
                Répondre à{" "}
                {(() => {
                  // Recherche récursive du nom de l'auteur
                  const findAuthor = (
                    list: Comment[],
                    id: string
                  ): string | null => {
                    for (const c of list) {
                      if (c.id === id) return c.author;
                      const sub = findAuthor(c.replies, id);
                      if (sub) return sub;
                    }
                    return null;
                  };
                  return findAuthor(comments, replyingTo);
                })()}
              </span>
              <button
                onClick={() => setReplyingTo(null)}
                className="ml-auto text-foreground/40 hover:text-foreground/70"
              >
                Annuler
              </button>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-9 h-9 rounded-full bg-primary text-background flex items-center justify-center font-semibold text-xs">
                YO
              </div>
            </div>

            <div className="flex-1">
              <div className="border border-foreground/20 rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="w-full px-4 py-3 bg-background text-foreground placeholder:text-foreground/40 outline-none resize-none"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                      handleSubmit();
                  }}
                />

                <div className="flex items-center justify-between px-3 py-2 bg-background/50 border-t border-foreground/10">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setFormatting((f) => ({ ...f, bold: !f.bold }))
                      }
                      className={`p-2 rounded hover:bg-foreground/5 transition-colors ${
                        formatting.bold ? "text-primary" : "text-foreground/70"
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setFormatting((f) => ({ ...f, italic: !f.italic }))
                      }
                      className={`p-2 rounded hover:bg-foreground/5 transition-colors ${
                        formatting.italic
                          ? "text-primary"
                          : "text-foreground/70"
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded hover:bg-foreground/5 transition-colors text-foreground/70">
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!newComment.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-md hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer
                  </button>
                </div>
              </div>
              <p className="text-xs text-foreground/40 mt-2">
                Cmd + Entrée pour envoyer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
