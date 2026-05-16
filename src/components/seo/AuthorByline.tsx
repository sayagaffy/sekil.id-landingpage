import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface AuthorBylineProps {
  name: string;
  credential?: string;
  affiliation?: string;
  photo?: string;
  publishedAt: string;
  modifiedAt?: string;
}

export function AuthorByline({
  name,
  credential,
  affiliation,
  photo,
  publishedAt,
  modifiedAt,
}: AuthorBylineProps) {
  const published = new Date(publishedAt);
  const modified = modifiedAt ? new Date(modifiedAt) : null;

  return (
    <div
      className="flex items-start gap-3 text-sm text-muted-foreground"
      itemScope
      itemType="https://schema.org/Person"
    >
      {photo && (
        <Image
          src={photo}
          alt={name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      )}
      <div>
        <p className="font-medium text-foreground" itemProp="name">
          {name}
          {credential && (
            <span className="ml-1 font-normal text-muted-foreground">{credential}</span>
          )}
        </p>
        {affiliation && (
          <p itemProp="affiliation" itemScope itemType="https://schema.org/Organization">
            <span itemProp="name">{affiliation}</span>
          </p>
        )}
        <p className="text-xs">
          <time dateTime={publishedAt} itemProp="datePublished">
            Diterbitkan {format(published, 'd MMMM yyyy', { locale: id })}
          </time>
          {modified && (
            <>
              {' · '}
              <time dateTime={modifiedAt} itemProp="dateModified">
                Diperbarui {format(modified, 'd MMMM yyyy', { locale: id })}
              </time>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
