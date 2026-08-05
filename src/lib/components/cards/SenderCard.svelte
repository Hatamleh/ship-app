<script lang="ts">
  import { User } from 'lucide-svelte'
  import { t } from '$lib/translations'

  let { formData }: { formData: Record<string, any> } = $props()
</script>

<!--
  The sender is taken from the signed-in account and is not editable, so this is
  a summary rather than a form card. It is a <section> with a heading so it can
  be found with getByRole('region', { name: 'Sender Information' }).
-->
<section aria-labelledby="sender-heading" class="bg-muted p-4 rounded-lg shadow border border-border">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 bg-nord-frost-1/20 rounded-full flex items-center justify-center">
      <User class="w-5 h-5 text-primary" aria-hidden="true" />
    </div>
    <div class="flex-1">
      <h2 id="sender-heading" class="text-sm font-medium text-muted-foreground">
        {t('form.senderInformation')}
      </h2>
      <p class="text-foreground font-semibold">
        {formData.senderName || ''} - {formData.senderCountry || ''}
      </p>
    </div>
  </div>
  <p class="text-xs text-muted-foreground/70 mt-3">
    Sender details are filled from your account automatically and cannot be edited
  </p>
</section>
