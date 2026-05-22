import releaseNotes from "@/data/release-notes.json";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("releaseNotes");
  return {
    title: `${t("title")} | Spoti-Guessr`,
  };
}

export default async function ReleaseNotesPage() {
  const t = await getTranslations("releaseNotes");

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 lg:p-4">
      <h2>{t("title")}</h2>
      <div className="flex flex-col gap-6">
        {releaseNotes.map((release) => (
          <section
            key={release.version}
            className="rounded-xl bg-muted/50 p-4 lg:p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-md bg-primary px-2 py-1 text-sm font-bold text-primary-foreground">
                {release.version}
              </span>
              <span className="text-sm text-muted-foreground">
                {release.date}
              </span>
            </div>

            {release.features.length > 0 && (
              <div className="mb-3">
                <h4 className="mb-1 text-sm font-semibold text-green-600 dark:text-green-400">
                  {t("newFeatures")}
                </h4>
                <ul className="list-inside list-disc space-y-1 pl-2 text-sm text-muted-foreground">
                  {release.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {release.fixes.length > 0 && (
              <div className="mb-3">
                <h4 className="mb-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {t("bugFixes")}
                </h4>
                <ul className="list-inside list-disc space-y-1 pl-2 text-sm text-muted-foreground">
                  {release.fixes.map((fix) => (
                    <li key={fix}>{fix}</li>
                  ))}
                </ul>
              </div>
            )}

            {release.breaking.length > 0 && (
              <div>
                <h4 className="mb-1 text-sm font-semibold text-red-600 dark:text-red-400">
                  {t("breakingChanges")}
                </h4>
                <ul className="list-inside list-disc space-y-1 pl-2 text-sm text-muted-foreground">
                  {release.breaking.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
